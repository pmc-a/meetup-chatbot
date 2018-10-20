const axios = require('axios');
const { CardFactory, MessageFactory } = require('botbuilder');

async function handleIntent(turnContext, luisResult) {
  // LUIS result entities sometimes come back as space separated
  const meetupEntity = luisResult.entities[0].entity.split(' ').join('');
  let apiResult = await axios.get(
    `https://api.meetup.com/${meetupEntity}/events?&sign=true&photo-host=public&status=past`
  );

  // LUIS result returns entity and resolution value i.e. 'four' returns resolution value of 4
  const numberOfPastEvents = luisResult.entities[1].resolution.value;

  // Grabs the past number of events specified by the user
  const pastEvents = apiResult.data.slice(apiResult.data.length - numberOfPastEvents);

  const eventCards = pastEvents.map(event => {
    return CardFactory.heroCard(
      event.name,
      event.description,
      CardFactory.actions([
        { type: 'openUrl', title: 'See More', value: event.link }
      ])
    );
  });

  // Creates a carousel of the hero cards for each event
  const messageWithCarouselOfCards = MessageFactory.carousel(eventCards);

  await turnContext.sendActivity(messageWithCarouselOfCards);
}

module.exports = {
  handleIntent: handleIntent
};