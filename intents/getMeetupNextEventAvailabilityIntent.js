const axios = require('axios');

async function handleIntent(turnContext, luisResult) {
  // LUIS result entities sometimes come back as space separated
  const meetupEntity = luisResult.entities[0].entity.split(' ').join('');
  const apiResult = await axios.get(
    `https://api.meetup.com/${meetupEntity}/events?&sign=true&photo-host=public&page=20`
  );
  const meetupInfo = apiResult.data[0];

  if (meetupInfo !== undefined) {
    const responseMessage = 
      meetupInfo.yes_rsvp_count < meetupInfo.rsvp_limit ? 
      `Yes! There is space available at the next event: ${meetupInfo.name}` :
      `Unforunately, ${meetupInfo.name} is full. There is currently a waitlist with ${meetupInfo.waitlist_count} members on it.`;

      // TODO: Add functionality to POST request to Meetup API to join event/waitlist if available

    await turnContext.sendActivity(responseMessage);
  } else {
    await turnContext.sendActivity(`Hmm, it looks like ${meetupEntity} haven't scheduled a new event yet!`);
  }
}

module.exports = {
  handleIntent: handleIntent
};