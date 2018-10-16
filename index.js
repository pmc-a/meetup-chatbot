const path = require('path');
const express = require('express');
const serverlessHttp = require('serverless-http');

// Bot Framework dependencies
const { BotFrameworkAdapter } = require('botbuilder');
const { BotConfiguration } = require('botframework-config');
const { LuisBot } = require('./bot');

const app = express();

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const BOT_FILE = path.join(__dirname, (process.env.botFilePath || './meetup-chatbot.bot'));
let botConfig;
try {
    // Read configuration from .bot file.
    botConfig = BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret);
} catch (err) {
    console.error(`\nError reading bot file. Please ensure you have valid botFilePath and botFileSecret set for your environment.`);
    console.error(`\n - The botFileSecret is available under appsettings for your Azure Bot Service bot.`);
    console.error(`\n - If you are running this bot locally, consider adding a .env file with botFilePath and botFileSecret.\n\n`);
    process.exit();
}

const BOT_CONFIGURATION = (process.env.NODE_ENV || 'development');

// Get endpoint configurations by service name.
const endpointConfig = botConfig.findServiceByNameOrId(BOT_CONFIGURATION);

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
    appId: endpointConfig.appId || process.env.MicrosoftAppId,
    appPassword: endpointConfig.appPassword || process.env.MicrosoftAppPassword
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
