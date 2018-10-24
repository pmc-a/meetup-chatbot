async function handleIntent(turnContext) {
  await turnContext.sendActivity('Ask me something to get started, or ask me for some help');
}

module.exports = {
  handleIntent: handleIntent
}