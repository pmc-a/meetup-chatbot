const { MessageFactory } = require('botbuilder');

const helpIntent = require('../helpIntent');

describe('helpIntent', () => {
  let intent;

  beforeEach(() => {
    intent = helpIntent.handleIntent;
  });

  it('should create a suggestedActions activityType and respond to the user', async () => {
    const mockTurnContext = { sendActivity: jest.fn() };
    const mockSuggestedActions = MessageFactory.suggestedActions([
      'Can you give me some information about Belfast-JS?',
      'What have the previous three PyBelfast events been like?',
      'Can I attend the next Charged meetup?'
    ], 'Ok, here are some things that you can ask me!');

    await intent(mockTurnContext);

    expect(mockTurnContext.sendActivity).toHaveBeenCalledWith(mockSuggestedActions);
  });
});