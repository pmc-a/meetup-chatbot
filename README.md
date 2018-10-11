[![Build Status](https://dev.azure.com/pmcaree08/Meetup%20Chatbot/_apis/build/status/pmc-a.meetup-chatbot)](https://dev.azure.com/pmcaree08/Meetup%20Chatbot/_build/latest?definitionId=1)

# Meetup Chatbot

A chatbot that will provide you with information about various events and meetups via the Meetup API.

## Getting Started

### Prerequisites

Need to have the following installed locally:
- [Node.js](https://nodejs.org) - v8.12.0+
- [npm](https://www.npmjs.com) - v6.4.1+
- [MS Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases) - v3.5.36+

### Installation

You will need to create a new [LUIS application](https://luis.ai/) - you can do this over at their web application. Follow the instructions to **create and publish the application**, you will then receive the necessary application IDs and authoring keys (required for environment variables below).

Next, you need to create a `.env` file to store environment variables:

```
botFilePath="./meetup-chatbot.bot"
botFileSecret=""
luisAppId="<<Your LUIS application ID>>"
luisAuthoringKey="<<Your LUIS authoring key>>"
luisAzureRegion="<<Your LUIS application region>>"
```

Finally, run the following commands:

```
$ npm install && npm start
```

The service should be running on `http://localhost:3978`.

Open up the Bot Emulator and point it to `http://localhost:3978/api/messages` and you should be able to begin chatting to the bot.

### Testing

Project utilises Jest to coordinate the unit testing. Simply run the following to execute the unit tests:

```
$ npm run test
```

Output should be produced in your terminal.

### Technology

Utilises the following:

- Microsoft Bot Framework
- LUIS.ai
- Node.js (Restify)
- Azure DevOps Pipelines
