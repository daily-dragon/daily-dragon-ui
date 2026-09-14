import {getDeepPracticeSentences} from '../../../services/ai/aiService.js';

jest.mock('../../../services/auth.js', () => ({
    getToken: jest.fn(() => Promise.resolve('test-token')),
}));

describe('aiService.getDeepPracticeSentences', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        delete global.fetch;
    });

    test('sends POST to /learning/deep-practice-sentences with correct body', async () => {
        global.fetch.mockResolvedValueOnce({ok: true, json: async () => ({sentences: []})});

        await getDeepPracticeSentences('爱', null);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const [url, options] = global.fetch.mock.calls[0];
        expect(url).toContain('/learning/deep-practice-sentences');
        expect(options.method).toBe('POST');
        const body = JSON.parse(options.body);
        expect(body.word).toBe('爱');
        expect(body).not.toHaveProperty('hsk_level');
    });

    test('includes hsk_level when provided', async () => {
        global.fetch.mockResolvedValueOnce({ok: true, json: async () => ({sentences: []})});

        await getDeepPracticeSentences('爱', 3);

        const body = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(body.hsk_level).toBe(3);
    });

    test('omits hsk_level when null', async () => {
        global.fetch.mockResolvedValueOnce({ok: true, json: async () => ({sentences: []})});

        await getDeepPracticeSentences('爱', null);

        const body = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(body).not.toHaveProperty('hsk_level');
    });

    test('throws on non-ok response', async () => {
        global.fetch.mockResolvedValueOnce({ok: false, statusText: 'Internal Server Error'});

        await expect(getDeepPracticeSentences('爱', null)).rejects.toThrow('API error');
    });

    test('sends Authorization header', async () => {
        global.fetch.mockResolvedValueOnce({ok: true, json: async () => ({sentences: []})});

        await getDeepPracticeSentences('爱', null);

        const [_, options] = global.fetch.mock.calls[0];
        expect(options.headers['Authorization']).toBe('Bearer test-token');
    });
});
