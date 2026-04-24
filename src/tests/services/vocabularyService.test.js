import { getDueVocabulary, submitReviews } from '../../services/vocabularyService.js';
import { getToken } from '../../services/auth.js';

jest.mock('../../services/auth.js', () => ({
    getToken: jest.fn()
}));

describe('vocabularyService.getDueVocabulary', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        getToken.mockResolvedValue('test-token');
    });

    afterEach(() => {
        jest.resetAllMocks();
        delete global.fetch;
    });

    test('calls /vocabulary/due with Authorization header and returns word strings', async () => {
        const fakeResponse = {
            due_words: [
                { word: '你好', metadata: { ease_factor: 2.5, days_overdue: 1 } },
                { word: '谢谢', metadata: { ease_factor: 2.5, days_overdue: 3 } }
            ],
            returned: 2
        };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeResponse
        });

        const result = await getDueVocabulary();

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const [url, options] = global.fetch.mock.calls[0];
        expect(url).toContain('/vocabulary/due');
        expect(options.headers.get('Authorization')).toBe('Bearer test-token');
        expect(result).toEqual(['你好', '谢谢']);
    });

    test('throws when response is not ok', async () => {
        global.fetch.mockResolvedValueOnce({ ok: false, statusText: 'Not Found' });
        await expect(getDueVocabulary()).rejects.toThrow('Failed to fetch vocabulary data');
    });
});

describe('vocabularyService.submitReviews', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        getToken.mockResolvedValue('test-token');
    });

    afterEach(() => {
        jest.resetAllMocks();
        delete global.fetch;
    });

    test('POSTs reviews with Authorization header and correct body', async () => {
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

        const reviews = [
            { word: '你好', quality: 8 },
            { word: '谢谢', quality: 5 }
        ];

        await submitReviews(reviews);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const [url, options] = global.fetch.mock.calls[0];
        expect(url).toContain('/vocabulary/reviews');
        expect(options.method).toBe('POST');
        expect(options.headers['Authorization']).toBe('Bearer test-token');
        expect(options.headers['Content-Type']).toBe('application/json');
        expect(JSON.parse(options.body)).toEqual({ reviews });
    });

    test('throws when response is not ok', async () => {
        global.fetch.mockResolvedValueOnce({ ok: false, statusText: 'Internal Server Error' });
        await expect(submitReviews([{ word: '你好', quality: 5 }])).rejects.toThrow('Failed to submit reviews');
    });
});
