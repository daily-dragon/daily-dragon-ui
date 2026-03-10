import { submitTranslations, getPracticeSentences } from '../../../services/ai/aiService.js';

jest.mock('../../../services/auth.js', () => ({
  getToken: jest.fn(() => 'test-token')
}));

describe('aiService.submitTranslations', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete global.fetch;
  });

  test('sends translations array and Authorization header, returns mapped evaluations', async () => {
    const fakeEvaluations = {
      evaluations: [
        {
          sentence: 'I like this book.',
          translation: '我喜欢这本书',
          target_word: '喜欢',
          word_used: '喜欢',
          feedback: 'Good',
          correct_sentence: '',
          score: 10
        }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeEvaluations
    });

    const payload = [
      { word: '喜欢', sentence: 'I like this book.', translation: '我喜欢这本书' }
    ];

    const result = await submitTranslations({ translations: payload });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const fetchArgs = global.fetch.mock.calls[0];
    const requestBody = JSON.parse(fetchArgs[1].body);

    expect(requestBody).toEqual({ translations: payload });
    expect(fetchArgs[1].headers['Content-Type']).toBe('application/json');
    expect(fetchArgs[1].headers['Authorization']).toContain('Bearer');

    expect(result).toEqual([
      {
        originalSentence: 'I like this book.',
        userTranslation: '我喜欢这本书',
        targetWord: '喜欢',
        wordUsed: '喜欢',
        feedback: 'Good',
        correctSentence: '',
        score: 10
      }
    ]);
  });

  test('accepts legacy words/sentences/translations triple', async () => {
    const fakeEvaluations = { evaluations: [] };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => fakeEvaluations });

    const words = ['喜', '喝'];
    const sentences = ['S1', 'S2'];
    const translations = ['T1', 'T2'];

    await submitTranslations({ words, sentences, translations });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(requestBody.translations.length).toBe(2);
    expect(requestBody.translations[0]).toEqual({ word: '喜', sentence: 'S1', translation: 'T1' });
  });

  test('parses string response payload', async () => {
    const fakeEvaluations = {
      evaluations: [
        { sentence: 'Hello', translation: '你好', target_word: '你好', word_used: '你好', feedback: 'ok', correct_sentence: '', score: 5 }
      ]
    };

    // server returns a JSON string (stringified JSON)
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => JSON.stringify(fakeEvaluations) });

    const payload = [ { word: '你好', sentence: 'Hello', translation: '你好' } ];
    const result = await submitTranslations({ translations: payload });

    expect(result[0].originalSentence).toBe('Hello');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('throws when server returns invalid JSON string', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => 'not-a-json' });

    const payload = [ { word: 'x', sentence: 'S', translation: 'T' } ];
    await expect(submitTranslations({ translations: payload })).rejects.toThrow();
  });

  test('throws when submitTranslations response.ok is false', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, statusText: 'Bad' });

    const payload = [ { word: 'x', sentence: 'S', translation: 'T' } ];
    await expect(submitTranslations({ translations: payload })).rejects.toThrow('API error');
  });

  test('throws on invalid input', async () => {
    await expect(submitTranslations({})).rejects.toThrow('Invalid input for submitTranslations');
  });

  // Additional branch coverage tests
  test('accepts array input directly', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ evaluations: [] }) });
    const payload = [ { word: 'a', sentence: 'S', translation: 'T' } ];
    await submitTranslations(payload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(Array.isArray(requestBody.translations)).toBe(true);
    expect(requestBody.translations[0]).toEqual(payload[0]);
  });

  test('handles translations-only input (no words/sentences)', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ evaluations: [] }) });
    await submitTranslations({ translations: ['X','Y'] });
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(requestBody.translations[0]).toEqual({ translation: 'X' });
  });

  test('accepts server response as plain array', async () => {
    const evals = [ { sentence: 'S', translation: 'T', target_word: 'w', word_used: 'w', feedback: 'f', correct_sentence: '', score: 1 } ];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => evals });
    const payload = [ { word: 'w', sentence: 'S', translation: 'T' } ];
    const result = await submitTranslations({ translations: payload });
    expect(result[0].originalSentence).toBe('S');
  });
});

describe('aiService.getPracticeSentences', () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.resetAllMocks(); delete global.fetch; });

  test('throws when getPracticeSentences response.ok is false', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, statusText: 'Not Found' });
    await expect(getPracticeSentences(['a'])).rejects.toThrow('API error');
  });

  test('success returns parsed JSON', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ sentences: [] }) });
    const res = await getPracticeSentences(['a']);
    expect(res).toEqual({ sentences: [] });
  });
});
