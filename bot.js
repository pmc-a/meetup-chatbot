const axios = require('axios');
const { ActivityTypes, CardFactory } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');

// Intents
const GET_MEEUP_INFO_INTENT = 'GetMeetupInfo';
const GREETING_INTENT = 'Greeting';

class LuisBot {
    constructor(application, luisPredictionOptions, includeApiResults) {
        this.luisRecognizer = new LuisRecognizer(application, luisPredictionOptions, true);
    }

    async onTurn(turnContext) {
        // By checking the incoming Activity type, the bot only calls LUIS in appropriate cases.
        if (turnContext.activity.type === ActivityTypes.Message) {
            const results = await this.luisRecognizer.recognize(turnContext);
            const topIntent = results.luisResult.topScoringIntent;

            // TODO: Reply to user with nice heroCard containing Meetup API response details
            // E.g. image, name, short description etc.
            const card = CardFactory.heroCard('HeroCard Title!');

            let reply = { type: ActivityTypes.Message };
            reply.attachments = [card];

            console.log(results.luisResult);

            if (topIntent.intent !== 'None') {
              
                switch(topIntent.intent) {
                    case GET_MEEUP_INFO_INTENT:
                        const result = await axios.get('https://api.meetup.com/2/groups?key=7b2c7229536f2f392f6f524d7d3d1d1&&sign=true&photo-host=public&group_urlname=belfast-js&page=20');
                        console.log(result.data.results[0].name);
                        await turnContext.sendActivity(`Meetup name: ${result.data.results[0].name}`);
                        await turnContext.sendActivity(reply);
                    case GREETING_INTENT:
                        await turnContext.sendActivity('Hey! Ask me something to get started, or ask me for some help');
                }

                await turnContext.sendActivity(`LUIS Top Scoring Intent: ${ topIntent.intent }, Score: ${ topIntent.score }`);
            } else {
                await turnContext.sendActivity(`No LUIS intents were found.`);
            }
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate &&
            turnContext.activity.recipient.id !== turnContext.activity.membersAdded[0].id) {
            // If the Activity is a ConversationUpdate, send a greeting message to the user.
            await turnContext.sendActivity('Hey! I\'m the Meetup information chatbot. Start by asking me for some information.');
        } else if (turnContext.activity.type !== ActivityTypes.ConversationUpdate) {
            // Respond to all other Activity types.
            await turnContext.sendActivity(`[${ turnContext.activity.type }]-type activity detected.`);
        }
    }
}

module.exports.LuisBot = LuisBot;