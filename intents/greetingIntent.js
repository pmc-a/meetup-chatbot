async function handleIntent(turnContext) {
  await turnContext.sendActivity('Hey! Ask me something to get started, or ask me for some help');
}

module.exports = {
  handleIntent: handleIntent
}