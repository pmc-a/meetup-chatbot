const { LuisBot } = require('../bot');
const { LuisRecognizer } = require('botbuilder-ai');

jest.mock('botbuilder-ai');

describe('Bot', () => {
    let luisBot;
    let mockLuisRecognizerInstance;
    let mockRecognize;

    beforeEach(() => {
        LuisRecognizer.mockClear();
        luisBot = new LuisBot();

        // Mocking LuisRecognizer class & function
        mockLuisRecognizerInstance = LuisRecognizer.mock.instances[0];
        mockRecognize = mockLuisRecognizerInstance.recognize.mockResolvedValue({ luisResult: { topScoringIntent: 'mock-intent' } });
    });

    it('should construct LuisRecognizer class', () => {
        expect(LuisRecognizer).toHaveBeenCalledTimes(1);
    });

    it('should invoke LUIS recognize when user sends a message', () => {
        const mockTurnContext = { activity: { type: 'message' }, sendActivity: jest.fn() };

        luisBot.onTurn(mockTurnContext);

        expect(mockRecognize).toHaveBeenCalledTimes(1);
        expect(mockRecognize).toHaveBeenCalledWith(mockTurnContext);
    });

    it('should not invoke LUIS recognize when user sends any other type of response', () => {
        const mockTurnContext = { activity: { type: 'card' }, sendActivity: jest.fn() };

        luisBot.onTurn(mockTurnContext);

        expect(mockRecognize).not.toHaveBeenCalled();
    });
});