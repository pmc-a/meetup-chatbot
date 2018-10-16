const path = require('path');
const express = require('express');
const serverlessHttp = require('serverless-http');

// Bot Framework dependencies
const { BotFrameworkAdapter } = require('botbuilder');
const { LuisBot } = require('./bot');

const app = express();

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const luisApplication = {
    applicationId: process.env.LuisAppId,
    endpointKey: process.env.LuisAuthoringKey,
    azureRegion: process.env.LuisAzureRegion
};

const luisPredictionOptions = {
    includeAllIntents: true,
    log: true,
    staging: false
};

// Create adapter to facilitate communication
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
adapter.onTurnError = async(turnContext, err) => {
    console.error(`onTurnError: ${err}`);
    await turnContext.sendActivity(`Oops, something went wrong! Please try asking me something different.`);
};

// Create the LuisBot.
let bot;
try {
    bot = new LuisBot(luisApplication, luisPredictionOptions);
} catch (err) {
    console.error(`Couldn\'t init bot: ${err}`);
    process.exit();
}

// Listen for incoming requests.
app.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async(turnContext) => {
        await bot.onTurn(turnContext);
    });
});

app.listen(3978, () => {
    console.log(`Listening on 3978.`);
});

module.exports.handler = serverlessHttp(app);
