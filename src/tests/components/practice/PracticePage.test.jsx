import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

function renderPracticePage(onReview = jest.fn()) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <PracticePage onReview={onReview} />
    </ChakraProvider>
  );
}

async function waitForSentences() {
  await waitFor(() => expect(screen.getByText('I like this book.')).toBeInTheDocument());
}

test('practice flow: fetch sentences, enter translations, submit and call onReview', async () => {
  const onReview = jest.fn();

  renderPracticePage(onReview);

  await waitForSentences();

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

test('submit button is enabled when translations are empty', async () => {
  renderPracticePage();

  await waitForSentences();

  expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
});

test('shows confirmation dialog when submitting with empty translations', async () => {
  const onReview = jest.fn();
  renderPracticePage(onReview);

  await waitForSentences();

  // Leave all inputs empty and click submit
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => expect(screen.getByText('Incomplete translations')).toBeInTheDocument());
  expect(screen.getByText(/you've left some translations blank/i)).toBeInTheDocument();
  expect(onReview).not.toHaveBeenCalled();
});

test('go back button closes the confirmation dialog without submitting', async () => {
  const onReview = jest.fn();
  renderPracticePage(onReview);

  await waitForSentences();

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  await waitFor(() => expect(screen.getByText('Incomplete translations')).toBeInTheDocument());

  const dialog = screen.getByRole('dialog');
  fireEvent.click(within(dialog).getByRole('button', { name: /go back/i }));

  await waitFor(() => expect(screen.queryByText('Incomplete translations')).not.toBeInTheDocument());
  expect(onReview).not.toHaveBeenCalled();
});

test('confirm submit in dialog submits with empty translations and calls onReview', async () => {
  const onReview = jest.fn();
  renderPracticePage(onReview);

  await waitForSentences();

  // Fill only some inputs to trigger the confirmation path
  const inputs = screen.getAllByRole('textbox');
  inputs.slice(0, -1).forEach((input, i) => {
    fireEvent.change(input, { target: { value: `T${i}` } });
  });

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  await waitFor(() => expect(screen.getByText('Incomplete translations')).toBeInTheDocument());

  const dialog = screen.getByRole('dialog');
  fireEvent.click(within(dialog).getByRole('button', { name: /submit/i }));

  await waitFor(() => expect(onReview).toHaveBeenCalled());
});
