const restify = require('restify');

// MS Botframework modules
const { BotFrameworkAdapter } = require('botbuilder');

// Library to handle bot config i.e. loads bot secrets, LUIS API credentials etc.
const { BotConfiguration } = require('botframework-config');

const ENV_FILE = path.join(__dirname, '.env');
const env = require('dotenv').config({ path: ENV_FILE });

// Loads .bot file configuration
const BOT_FILE = path.join(__dirname, (process.env.botFilePath || ''));
const botConfig = BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret);

const adapter = new BotFrameworkAdapter({
    appId: endpointConfig.appId || process.env.MicrosoftAppId,
    appPassword: endpointConfig.appPassword || process.env.MicrosoftAppPassword
});

let server = restify.createServer();
server.listen(process.env.port || 3978, () => {
    console.log(`${ server.name } listening on ${ server.url }`);
});

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async(turnContext) => {
        await bot.onTurn(turnContext);
    });
});
