const { MessageFactory } = require('botbuilder');

async function handleIntent(turnContext) {
  const reply = MessageFactory.suggestedActions([
    'Can you give me some information about Belfast-JS?',
    'What have the previous three PyBelfast events been like?',
    'Can I attend the next Charged meetup?'
  ], 'Ok, here are some things that you can ask me!');

  await turnContext.sendActivity(reply);
}

module.exports = {
  handleIntent: handleIntent
}