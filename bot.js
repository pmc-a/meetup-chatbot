const { ActivityTypes } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');

const getMeetupInfoIntent = require('./intents/getMeetupInfoIntent');
const getMeetupPastEventsIntent = require('./intents/getMeetupPastEventsIntent');
const getMeetupNextEventAvailability = require('./intents/getMeetupNextEventAvailabilityIntent');
const helpIntent = require('./intents/helpIntent');
const greetingIntent = require('./intents/greetingIntent');

// Intents
const GET_MEEUP_INFO_INTENT = 'GetMeetupInfo';
const GET_MEETUP_PAST_EVENTS_INTENT = 'GetMeetupPastEvents';
const GET_MEETUP_NEXT_EVENT_AVAILABILITY = 'GetMeetupNextEventAvailability';
const HELP_INTENT = 'Help';
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

            if (topIntent.intent !== 'None') {
              
                switch(topIntent.intent) {
                    case GET_MEEUP_INFO_INTENT:
                        await getMeetupInfoIntent.handleIntent(turnContext, results.luisResult);
                        break;
                    case GET_MEETUP_PAST_EVENTS_INTENT:
                        await getMeetupPastEventsIntent.handleIntent(turnContext, results.luisResult);
                        break;
                    case GET_MEETUP_NEXT_EVENT_AVAILABILITY:
                        await getMeetupNextEventAvailability.handleIntent(turnContext, results.luisResult);
                        break;
                    case HELP_INTENT:
                        await helpIntent.handleIntent(turnContext);
                        break;
                    case GREETING_INTENT:
                        await greetingIntent.handleIntent(turnContext);
                        break;
                }
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