const axios = require('axios');
const { CardFactory, MessageFactory } = require('botbuilder');

const getMeetupPastEventsIntent = require('../getMeetupPastEventsIntent');

jest.mock('axios');

describe('getMeetupPastEventsIntent', () => {
  const mockApiKey = 'mock-api-key';
  const mockLuisEntity = 'pybelfast';

  let intent;
  let mockTurnContext;
  let mockLuisResult;
  let mockMeetupApiResponse;

  beforeEach(() => {
    intent = getMeetupPastEventsIntent.handleIntent;
    mockTurnContext = {
      sendActivity: jest.fn()
    };

    mockLuisResult = {
      entities: [{
        entity: mockLuisEntity
      }, {
        resolution: {
          value: '1'
        }
      }]
    };

    mockMeetupApiResponse = {
      data: [{
          name: 'PyBelfast',
          group_photo: {
            highres_link: 'mock-url'
          },
          link: 'mock-link'
        }, {
          name: 'Charged',
          description: 'Mock description for Charged',
          group_photo: {
            highres_link: 'mock-url'
          },
          link: 'mock-link'
      }]
    };

    // Mock Meetup API key environment variable
    process.env.MeetupApiKey = mockApiKey;

    // Mock Axios Meetup API get request
    axios.get = jest.fn().mockResolvedValue(mockMeetupApiResponse);
  });

  afterEach(() => {
    // Ensure that mock API key is cleaned up after
    delete process.env.MeetupApiKey;
  });

  it('should make a request to the meetup API with the correct entity', async () => {
    await intent(mockTurnContext, mockLuisResult);

    expect(axios.get).toHaveBeenCalledWith(`https://api.meetup.com/${mockLuisEntity}/events?&sign=true&photo-host=public&status=past`);
  });

  it('should create a carousel of cards with the correct meetup info before sending back to the user', async () => {
    MessageFactory.carousel = jest.fn();
    const mockCard = CardFactory.heroCard(
      'Charged',
      'Mock description for Charged',
      CardFactory.actions([
        { type: 'openUrl', title: 'See More', value: 'mock-link' }
      ])
    );
    
    await intent(mockTurnContext, mockLuisResult);

    expect(MessageFactory.carousel).toHaveBeenCalledWith([mockCard]);
  });
});