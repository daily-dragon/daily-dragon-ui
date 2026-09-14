import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {ChakraProvider, defaultSystem} from '@chakra-ui/react';
import DeepPractice from '../../../components/learning/DeepPractice.jsx';

jest.mock('../../../components/ui/toaster.jsx', () => ({
    toaster: {create: jest.fn()},
}));

jest.mock('../../../services/ai/aiService.js', () => ({
    getDeepPracticeSentences: jest.fn(() => Promise.resolve({
        sentences: [
            {sentence: 'I love this book.', usage_hint: 'as a verb'},
            {sentence: 'She has a deep love for music.', usage_hint: 'as a noun'},
        ],
    })),
    submitTranslations: jest.fn(() => Promise.resolve([{
        originalSentence: 'I love this book.',
        userTranslation: '我爱这本书。',
        targetWord: '爱',
        target_word_pinyin: 'ài',
        wordUsed: '爱',
        feedback: 'Excellent!',
        correctSentence: '我爱这本书。',
        score: 9,
    }])),
}));

jest.mock('../../../services/vocabularyService.js', () => ({
    submitReviews: jest.fn(),
}));

const mockCard = {word: '爱', pinyin: 'ài', meanings: ['to love', 'love']};

function renderDeepPractice(props = {}) {
    const onClose = props.onClose || jest.fn();
    return {
        onClose,
        ...render(
            <ChakraProvider value={defaultSystem}>
                <DeepPractice card={mockCard} hskLevel={2} onClose={onClose} {...props}/>
            </ChakraProvider>
        ),
    };
}

async function waitForSentence() {
    await waitFor(() => expect(screen.getByText('I love this book.')).toBeInTheDocument());
}

afterEach(() => {
    jest.clearAllMocks();
});

test('shows loading spinner on mount', () => {
    renderDeepPractice();
    expect(screen.getByText(/generating sentences for 爱/i)).toBeInTheDocument();
});

test('calls getDeepPracticeSentences with word and hskLevel', async () => {
    renderDeepPractice();
    await waitForSentence();
    const {getDeepPracticeSentences} = require('../../../services/ai/aiService.js');
    expect(getDeepPracticeSentences).toHaveBeenCalledWith('爱', 2);
});

test('renders sentence and usage hint after loading', async () => {
    renderDeepPractice();
    await waitForSentence();
    expect(screen.getByText('as a verb')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
});

test('displays word and pinyin', async () => {
    renderDeepPractice();
    await waitForSentence();
    expect(screen.getAllByText('爱').length).toBeGreaterThan(0);
    expect(screen.getByText('ài')).toBeInTheDocument();
});

test('Check button is disabled when input is empty', async () => {
    renderDeepPractice();
    await waitForSentence();
    expect(screen.getByRole('button', {name: /check/i})).toBeDisabled();
});

test('Check button is enabled when input has text', async () => {
    renderDeepPractice();
    await waitForSentence();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '我爱这本书'}});
    expect(screen.getByRole('button', {name: /check/i})).not.toBeDisabled();
});

test('submitting calls submitTranslations with correct payload', async () => {
    renderDeepPractice();
    await waitForSentence();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '我爱这本书。'}});
    fireEvent.click(screen.getByRole('button', {name: /check/i}));

    const {submitTranslations} = require('../../../services/ai/aiService.js');
    await waitFor(() => expect(submitTranslations).toHaveBeenCalledWith([{
        word: '爱',
        sentence: 'I love this book.',
        translation: '我爱这本书。',
    }]));
});

test('never calls submitReviews — no SRS impact', async () => {
    renderDeepPractice();
    await waitForSentence();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '我爱这本书。'}});
    fireEvent.click(screen.getByRole('button', {name: /check/i}));

    await waitFor(() => expect(screen.getByText('Excellent!')).toBeInTheDocument());

    const {submitReviews} = require('../../../services/vocabularyService.js');
    expect(submitReviews).not.toHaveBeenCalled();
});

test('shows feedback and score after submission', async () => {
    renderDeepPractice();
    await waitForSentence();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '我爱这本书。'}});
    fireEvent.click(screen.getByRole('button', {name: /check/i}));

    await waitFor(() => expect(screen.getByText('Excellent!')).toBeInTheDocument());
    expect(screen.getByText('9 / 10')).toBeInTheDocument();
});

test('Next button advances to second sentence', async () => {
    renderDeepPractice();
    await waitForSentence();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '我爱这本书。'}});
    fireEvent.click(screen.getByRole('button', {name: /check/i}));
    await waitFor(() => expect(screen.getByRole('button', {name: /next/i})).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', {name: /next/i}));

    await waitFor(() => expect(screen.getByText('She has a deep love for music.')).toBeInTheDocument());
    expect(screen.getByText('as a noun')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
});

test('shows See Results on last sentence', async () => {
    renderDeepPractice();
    await waitForSentence();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '我爱这本书。'}});
    fireEvent.click(screen.getByRole('button', {name: /check/i}));
    await waitFor(() => expect(screen.getByRole('button', {name: /next/i})).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', {name: /next/i}));
    await waitFor(() => expect(screen.getByText('She has a deep love for music.')).toBeInTheDocument());

    fireEvent.change(screen.getByRole('textbox'), {target: {value: '她对音乐有深深的爱。'}});
    fireEvent.click(screen.getByRole('button', {name: /check/i}));

    await waitFor(() => expect(screen.getByRole('button', {name: /see results/i})).toBeInTheDocument());
    expect(screen.queryByRole('button', {name: /^next$/i})).not.toBeInTheDocument();
});

test('complete screen shows summary and back button', async () => {
    renderDeepPractice();
    await waitForSentence();

    for (let i = 0; i < 2; i++) {
        await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument());
        fireEvent.change(screen.getByRole('textbox'), {target: {value: '我爱这本书。'}});
        fireEvent.click(screen.getByRole('button', {name: /check/i}));
        const nextOrResults = await waitFor(() =>
            screen.getByRole('button', {name: /next|see results/i})
        );
        fireEvent.click(nextOrResults);
    }

    await waitFor(() => expect(screen.getByText(/deep practice complete/i)).toBeInTheDocument());
    expect(screen.getByRole('button', {name: /back to cards/i})).toBeInTheDocument();
});

test('Back button calls onClose', async () => {
    const onClose = jest.fn();
    renderDeepPractice({onClose});
    await waitForSentence();
    fireEvent.click(screen.getByRole('button', {name: /back/i}));
    expect(onClose).toHaveBeenCalled();
});

test('shows error state when loading fails', async () => {
    const {getDeepPracticeSentences} = require('../../../services/ai/aiService.js');
    getDeepPracticeSentences.mockRejectedValueOnce(new Error('Network error'));

    renderDeepPractice();

    await waitFor(() => expect(screen.getByText(/failed to load practice sentences/i)).toBeInTheDocument());
    expect(screen.getByRole('button', {name: /try again/i})).toBeInTheDocument();
});

test('error state Back to cards button calls onClose', async () => {
    const {getDeepPracticeSentences} = require('../../../services/ai/aiService.js');
    getDeepPracticeSentences.mockRejectedValueOnce(new Error('Network error'));
    const onClose = jest.fn();

    renderDeepPractice({onClose});

    await waitFor(() => expect(screen.getByRole('button', {name: /back to cards/i})).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', {name: /back to cards/i}));
    expect(onClose).toHaveBeenCalled();
});
