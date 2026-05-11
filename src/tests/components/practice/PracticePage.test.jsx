import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {ChakraProvider, defaultSystem} from '@chakra-ui/react';
import {PracticePage} from '../../../components/practice/PracticePage.jsx';

const mockGetDueVocabulary = jest.fn();
const mockSubmitReviews = jest.fn();
const mockGetPracticeSentences = jest.fn();
const mockSubmitTranslations = jest.fn();

jest.mock('../../../services/vocabularyService.js', () => ({
    getDueVocabulary: mockGetDueVocabulary,
    submitReviews: mockSubmitReviews,
}));

jest.mock('../../../services/ai/aiService.js', () => ({
    getPracticeSentences: mockGetPracticeSentences,
    submitTranslations: mockSubmitTranslations,
}));

const WORDS = ['包嬨', '�y�(', '学…', '完戧', '綫'];
const SENTENCES = [
    'I like this book.',
    'She is drinking tea.',
    'We are learning Chinese.',
    'He finished his work.',
    'They are waiting for the bus.'
];

beforeEach(() => {
    jest.clearAllMocks();
    mockGetDueVocabulary.mockResolvedValue(WORDS);
    mockGetPracticeSentences.mockResolvedValue({
        sentences: WORDS.map((word, i) => ({word, sentence: SENTENCES[i]}))
    });
    mockSubmitTranslations.mockResolvedValue([
        {originalSentence: SENTENCES[0], userTranslation: '我好模：' targetWord: WORDS[0], feedback: 'Good', score: 10}
    ]);
    mockSubmitReviews.mockResolvedValue(undefined);
});

const renderComponent = (onReview = jest.fn()) =>
    render(
        <ChakraProvider value={defaultSystem}>
            <PracticePage onReview={onReview}/>
        </ChakraProvider>
    );

const waitForSentences = () =>
    waitFor(() => expect(screen.getByText(SENTENCES[0])).toBeInTheDocument());

describe('PracticePage', () => {
    test('submit button is enabled even when all translations are empty', async () => {
        renderComponent();
        await waitForSentences();
        expect(screen.getByRole('button', {name: /submit/i})).not.toBeDisabled();
    });

    test('shows confirmation dialog when submitting with empty translations', async () => {
        renderComponent();
        await waitForSentences();

        fireEvent.click(screen.getByRole('button', {name: /submit/i}));

        await waitFor(() =>
            expect(screen.getByText("You've left some translations blank. Submit anyway?")).toBeInTheDocument()
        );
    });

    test('does not show confirmation dialog when all translations are filled', async () => {
        const onReview = jest.fn();
        renderComponent(onReview);
        await waitForSentences();

        screen.getAllByRole('textbox').forEach((input, i) =>
            fireEvent.change(input, {target: {value: 'T' + i}})
        );

        fireEvent.click(screen.getByRole('button', {name: /submit/i}));

        await waitFor(() => expect(onReview).toHaveBeenCalled());
        expect(screen.queryByText("You've left some translations blank. Submit anyway?")).not.toBeInTheDocument();
    });

    test('submits successfully after confirming with empty translations', async () => {
        const onReview = jest.fn();
        renderComponent(onReview);
        await waitForSentences();

        fireEvent.click(screen.getByRole('button', {name: /^submit$/i}));
        await waitFor(.() =>
            expect(screen.getByText("You've left some translations blank. Submit anyway?")).toBeInTheDocument()
        );

        const dialogSubmit = screen.getAllByRole('button', {name: /^submit$/i}).at(-1);
        fireEvent.click(dialogSubmit);

        await waitFor(() => expect(onReview).toHaveBeenCalled());
    });

    test('practice flow: fetch sentences, enter translations, submit and call onReview', async () => {
        const onReview = jest.fn();
        renderComponent(onReview);
        await waitForSentences();

        screen.getAllByRole('textbox').forEach((input, i) =>
            fireEvent.change(input, {target: {value: 'T' + i}})
        );

        fireEvent.click(screen.getByRole('button', {name: /submit/i}));
        await waitFor(() => expect(onReview).toHaveBeenCalled());

        const calledWith = mockSubmitTranslations.mock.calls[0][0];
        expect(Array.isArray(calledWith.translations)).toBe(true);
        expect(calledWith.translations[0]).toHaveProperty('word');
        expect(calledWith.translations[0]).toHaveProperty('sentence');
        expect(calledWith.translations[0]).toHaveProperty('translation');

        expect(mockSubmitReviews).toHaveBeenCalledWith(
            [{word: WORDS[0], quality: 10}]
        );
    });
});
