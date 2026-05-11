import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { PracticePage } from '../../../components/practice/PracticePage.jsx';

jest.mock('../../../services/vocabularyService.js', () => ({
  getDueVocabulary: jest.fn(() => Promise.resolve(['喜欢', '喝', '学', '完成', '等'])),
  submitReviews: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../services/ai/aiService.js', () => ({
  getPracticeSentences: jest.fn(() => Promise.resolve({
    sentences: [
      { word: '喜欢', sentence: 'I like this book.' },
      { word: '喝', sentence: 'She is drinking tea.' },
      { word: '学', sentence: 'We are learning Chinese.' },
      { word: '完成', sentence: 'He finished his work.' },
      { word: '等', sentence: 'They are waiting for the bus.' }
    ]
  })),
  submitTranslations: jest.fn(() => Promise.resolve([
    { originalSentence: 'I like this book.', userTranslation: '我喜欢这本书', targetWord: '喜欢', feedback: 'Good', score: 10 }
  ]))
}));

test('practice flow: fetch sentences, enter translations, submit and call onReview', async () => {
  const onReview = jest.fn();

  render(
    <ChakraProvider value={defaultSystem}>
      <PracticePage onReview={onReview} />
    </ChakraProvider>
  );

  // Wait for sentences to be rendered
  await waitFor(() => expect(screen.getByText('I like this book.')).toBeInTheDocument());

  // Fill inputs
  const inputs = screen.getAllByRole('textbox');
  inputs.forEach((input, i) => {
    fireEvent.change(input, { target: { value: `T${i}` } });
  });

  // Click submit
  const submitButton = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(submitButton);

  // Wait for onReview to be called
  await waitFor(() => expect(onReview).toHaveBeenCalled());

  // Ensure submitTranslations was called with expected payload shape
  const { submitTranslations } = require('../../../services/ai/aiService.js');
  expect(submitTranslations).toHaveBeenCalled();
  const calledWith = submitTranslations.mock.calls[0][0];
  expect(Array.isArray(calledWith.translations)).toBe(true);
  expect(calledWith.translations[0]).toHaveProperty('word');
  expect(calledWith.translations[0]).toHaveProperty('sentence');
  expect(calledWith.translations[0]).toHaveProperty('translation');

  // Ensure submitReviews was called with word+quality pairs
  const { submitReviews } = require('../../../services/vocabularyService.js');
  expect(submitReviews).toHaveBeenCalled();
  const reviews = submitReviews.mock.calls[0][0];
  expect(Array.isArray(reviews)).toBe(true);
  expect(reviews[0]).toHaveProperty('word', '喜欢');
  expect(reviews[0]).toHaveProperty('quality', 10);
});
