const axios = require('axios');

const getMeetupNextEventAvailabilityIntent = require('../getMeetupNextEventAvailabilityIntent');

jest.mock('axios');

describe('getMeetupInfoIntent', () => {
  const mockApiKey = 'mock-api-key';
  const mockLuisEntity = 'belfast-js';

  let intent;
  let mockTurnContext;
  let mockLuisResult;
  let mockMeetupApiResponse;

  beforeEach(() => {
    intent = getMeetupNextEventAvailabilityIntent.handleIntent;
    mockTurnContext = {
      sendActivity: jest.fn()
    };
    mockLuisResult = {
      entities: [{
        entity: mockLuisEntity
      }]
    };
    mockMeetupApiResponse = {
      data: [{
        name: 'BelfastJS Event',
        yes_rsvp_count: 10,
        rsvp_limit: 50
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

    expect(axios.get).toHaveBeenCalledWith(`https://api.meetup.com/${mockLuisEntity}/events?&sign=true&photo-host=public&page=20`);
  });

  it('should send correct message to user when there is space at the event', async () => {
    await intent(mockTurnContext, mockLuisResult);

    expect(mockTurnContext.sendActivity).toHaveBeenCalledWith(`Yes! There is space available at the next event: BelfastJS Event`);
  });

  it('should send unavailable message to user with count of waitlist', async () => {
    mockMeetupApiResponse = {
      data: [{
        name: 'BelfastJS Event',
        yes_rsvp_count: 10,
        rsvp_limit: 1,
        waitlist_count: 15
      }]
    };

    axios.get = jest.fn().mockResolvedValue(mockMeetupApiResponse);

    await intent(mockTurnContext, mockLuisResult);

    expect(mockTurnContext.sendActivity).toHaveBeenCalledWith('Unforunately, BelfastJS Event is full. There is currently a waitlist with 15 members on it.');
  });

  it('should send no event message to user when there is no meetup scheduled', async () => {
    mockMeetupApiResponse = {
      data: []
    };

    axios.get = jest.fn().mockResolvedValue(mockMeetupApiResponse);

    await intent(mockTurnContext, mockLuisResult);

    expect(mockTurnContext.sendActivity).toHaveBeenCalledWith('Hmm, it looks like belfast-js haven\'t scheduled a new event yet!');
  });
});