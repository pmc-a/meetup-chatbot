const axios = require('axios');
const { ActivityTypes, CardFactory } = require('botbuilder');

async function handleIntent(turnContext, luisResult) {
  // LUIS result entities sometimes come back as space separated
  const meetupEntity = luisResult.entities[0].entity.split(' ').join('');
  const apiResult = await axios.get(
    `https://api.meetup.com/2/groups?key=${process.env.MeetupApiKey}&&sign=true&photo-host=public&group_urlname=${meetupEntity}`
  );
  const meetupInfo = apiResult.data.results[0];

  // TODO: Reply to user with nice heroCard containing Meetup API response details
  // E.g. image, name, short description etc.
  const card = CardFactory.heroCard(
    meetupInfo.name,
    'some subtitle text, hopefully?',
    [meetupInfo.group_photo.highres_link],
    CardFactory.actions([
      { type: 'openUrl', title: 'See More', value: meetupInfo.link }
    ])
  );

  let reply = { type: ActivityTypes.Message };
  reply.attachments = [card];

  await turnContext.sendActivity(`Meetup name: ${meetupInfo.name}`);
  await turnContext.sendActivity(reply);
}

module.exports = {
  handleIntent: handleIntent
};