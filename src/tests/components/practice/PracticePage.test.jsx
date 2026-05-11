import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {ChakraProvider, defaultSystem} from '@chakra-ui/react';
import {PracticePage} from '../../../components/practice/PracticePage.jsx';

jest.mock('../../../services/vocabularyService.js', () => ({
    getDueVocabulary: jest.fn(() => Promise.resolve(['好欢', '�y�(', '学', '完戙', '筫'])),
    submitReviews: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../services/ai/aiService.js', () => ({
    getPracticeSentences: jest.fn(() => Promise.resolve({
        sentences: [
            {word: '好嬨', sentence: 'I like this book.'},
            {word: '�y�(', sentence: 'She is drinking tea.'},
            {word: '学', sentence: 'We are learning Chinese.'},
            {word: '完戙', sentence: 'He finished his work.'},
            {word: '綫', sentence: 'They are waiting for the bus.'}
        ]
    })),
    submitTranslations: jest.fn(() => Promise.resolve([
        {originalSentence: 'I like this book.', userTranslation: '我好模迕朊', targetWord: '好嬨', feedback: 'Good', score: 10}
    ]))
}));

describe('PracticePage', () => {
    test('submit button is enabled even when all translations are empty', async () => {
        render(
            <ChakraProvider value={defaultSystem}>
                <PracticePage onReview={jest.fn()}/>
            </ChakraProvider>
        );
        await waitFor(() => expect(screen.getByText('I like this book.')).toBeInTheDocument());
        const submitButton = screen.getByRole('button', {name: /submit/i});
        expect(submitButton).not.toBeDisabled();
    });

    test('shows confirmation dialog when submitting with empty translations', async () => {
        render(
            <ChakraProvider value={defaultSystem}>
                <PracticePage onReview={jest.fn()}/>
            </ChakraProvider>
        );
        await waitFor(() => expect(screen.getByText('I like this book.')).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', {name: /submit/i}));

        await waitFor(() =>
            expect(screen.getByText("You've left some translations blank. Submit anyway?")).toBeInTheDocument()
        );
    });

    test('does not show confirmation dialog when all translations are filled', async () => {
        const onReview = jest.fn();
        render(
            <ChakraProvider value={defaultSystem}>
                <PracticePage onReview={onReview}/>
            </ChakraProvider>
        );
        await waitFor(() => expect(screen.getByText('I like this book.')).toBeInTheDocument());

        const inputs = screen.getAllByRole('textbox');
        inputs.forEach((input, i) => fireEvent.change(input, {target: {value: `T$vI``}}));

        fireEvent.click(screen.getByRole('button', {name: /submit/i}));

        await waitFor(() => expect(onReview).toHaveBeenCalled());
        expect(screen.queryByText("You've left some translations blank. Submit anyway?")).not.toBeInTheDocument();
    });

    test('submits successfully after confirming with empty translations', async () => {
        const onReview = jest.fn();
        render(
            <ChakraProvider value={defaultSystem}>
                <PracticePage onReview={onReview}/>
            </ChakraProvider>
        );
        await waitFor(() => expect(screen.getByText('I like this book.')).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', {name: /^submit$/i}));
        await waitFor(() =>
            expect(screen.getByText("You've left some translations blank. Submit anyway?")).toBeInTheDocument()
        );

        const dialogSubmit = screen.getAllByRole('button', {name: /^submit$/i}).at(-1);
        fireEvent.click(dialogSubmit);

        await waitFor(() => expect(onReview).toHaveBeenCalled());
    });

    test('practice flow: fetch sentences, enter translations, submit and call onReview', async () => {
        const onReview = jest.fn();
        render(
            <ChakraProvider value={defaultSystem}>
                <PracticePage onReview={onReview}/>
            </ChakraProvider>
        );
        await waitFor(() => expect(screen.getByText('I like this book.')).toBeInTheDocument());

        const inputs = screen.getAllByRole('textbox');
        inputs.forEach((input, i) => fireEvent.change(input, {target: {value: `T${i}`}}));

        fireEvent.click(screen.getByRole('button', {name: /submit/i}));
        await waitFor(() => expect(onReview).toHaveBeenCalled());

        const {submitTranslations} = require('../../../services/ai/aiService.js');
        const calledWith = submitTranslations.mock.calls[0][0];
        expect(Array.isArray(calledWith.translations)).toBe(true);
        expect(calledWith.translations[0]).toHaveProperty('word');
        expect(calledWith.translations[0]).toHaveProperty('sentence');
        expect(calledWith.translations[0]).toHaveProperty('translation');

        const {submitReviews} = require('../../../services/vocabularyService.js');
        const reviews = submitReviews.mock.calls[0][0];
        expect(reviews[0]).toHaveProperty('word', '包嬨');
        expect(reviews[0]).toHaveProperty('quality', 10);
    });
});
