const axios = require('axios');
const { ActivityTypes, CardFactory } = require('botbuilder');

const getMeetupInfoIntent = require('../getMeetupInfoIntent');

jest.mock('axios');

describe('getMeetupInfoIntent', () => {
  const mockApiKey = 'mock-api-key';
  const mockLuisEntity = 'belfast-js';

  let intent;
  let mockTurnContext;
  let mockLuisResult;
  let mockMeetupApiResponse;

  beforeEach(() => {
    intent = getMeetupInfoIntent.handleIntent;
    mockTurnContext = {
      sendActivity: jest.fn()
    };
    mockLuisResult = {
      entities: [{
        entity: mockLuisEntity
      }]
    };
    mockMeetupApiResponse = {
      data: {
        results: [{
          name: 'BelfastJS',
          description: 'Mock description about BelfastJS',
          group_photo: {
            highres_link: 'mock-url'
          },
          link: 'mock-link'
        }]
      }
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

    expect(axios.get).toHaveBeenCalledWith(`https://api.meetup.com/2/groups?key=${mockApiKey}&&sign=true&photo-host=public&group_urlname=${mockLuisEntity}`);
  });

  it('should correctly create a card object and return it to the user', async () => {
    const mockReply = { type: ActivityTypes.Message };
    const mockCard = CardFactory.heroCard(
      'BelfastJS',
      'Mock description about BelfastJS',
      ['mock-url'],
      CardFactory.actions([
        { type: 'openUrl', title: 'See More', value: 'mock-link' }
      ])
    );

    mockReply.attachments = [mockCard];

    await intent(mockTurnContext, mockLuisResult);

    expect(mockTurnContext.sendActivity).toHaveBeenCalledWith(`Meetup name: BelfastJS`);
    expect(mockTurnContext.sendActivity).toHaveBeenCalledWith(mockReply);
  });
});