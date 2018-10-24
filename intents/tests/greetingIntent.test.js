const greetingIntent = require('../greetingIntent');

describe('greetingIntent', () => {
  let intent;

  beforeEach(() => {
    intent = greetingIntent.handleIntent;
  });

  it('should call sendActivity with the correct greeting message', async () => {
    const greetingMessage = 'Ask me something to get started, or ask me for some help';
    const mockTurnContext = { sendActivity: jest.fn() };

    await intent(mockTurnContext);

    expect(mockTurnContext.sendActivity).toHaveBeenCalledWith(greetingMessage);
  });
});