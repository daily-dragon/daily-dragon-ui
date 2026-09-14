import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {ChakraProvider, defaultSystem} from '@chakra-ui/react';
import {MemoryRouter} from 'react-router-dom';
import LearningCarousel from '../../../components/learning/LearningCarousel.jsx';

const makeCards = (n = 5) =>
    Array.from({length: n}, (_, i) => ({
        word: `Word${i + 1}`,
        pinyin: `pinyin${i + 1}`,
        meanings: [`meaning of word ${i + 1}`],
        examples: [{chinese: `Example ${i + 1}`, english: `Economic ${i + 1}`}],
    }));

const wrap = (ui) => (
    <ChakraProvider value={defaultSystem}>
        <MemoryRouter>{ui}</MemoryRouter>
    </ChakraProvider>
);

describe('LearningCarousel', () => {
    test('renders the first card on mount', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        expect(screen.getByText('Word1')).toBeInTheDocument();
        expect(screen.getByText('1 / 5')).toBeInTheDocument();
    });

    test('Back button is visible on mount', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        expect(screen.getByText('Back')).toBeInTheDocument();
    });

    test('navigates to the next card on next arrow click', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        fireEvent.click(screen.getByLabelText('Next card'));
        expect(screen.getByText('Word2')).toBeInTheDocument();
        expect(screen.getByText('2 / 5')).toBeInTheDocument();
    });

    test('navigates back to previous card', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        fireEvent.click(screen.getByLabelText('Next card'));
        fireEvent.click(screen.getByLabelText('Previous card'));
        expect(screen.getByText('Word1')).toBeInTheDocument();
    });

    test('previous button is absent on first card', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        expect(screen.queryByLabelText('Previous card')).not.toBeInTheDocument();
    });

    test('shows Practice button on last card instead of next arrow', () => {
        const cards = makeCards(5);
        render(wrap(<LearningCarousel cards={cards} />));
        for (let i = 0; i < 4; i++) {
            fireEvent.click(screen.getByLabelText('Next card'));
        }
        expect(screen.queryByLabelText('Next card')).not.toBeInTheDocument();
        expect(screen.getByText('Practice these words now')).toBeInTheDocument();
    });

    test('card counter reflects current position', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        expect(screen.getByText('1 / 5')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Next card'));
        expect(screen.getByText('2 / 5')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Previous card'));
        expect(screen.getByText('1 / 5')).toBeInTheDocument();
    });

    test('Practice this word button is visible on every card', () => {
        render(wrap(<LearningCarousel cards={makeCards()} onDeepPractice={jest.fn()} />));
        expect(screen.getByText('Practice this word')).toBeInTheDocument();
    });

    test('Practice this word button calls onDeepPractice with current card', () => {
        const cards = makeCards(3);
        const onDeepPractice = jest.fn();
        render(wrap(<LearningCarousel cards={cards} onDeepPractice={onDeepPractice} />));
        fireEvent.click(screen.getByText('Practice this word'));
        expect(onDeepPractice).toHaveBeenCalledWith(cards[0]);
    });

    test('Practice this word button passes the correct card after navigation', () => {
        const cards = makeCards(3);
        const onDeepPractice = jest.fn();
        render(wrap(<LearningCarousel cards={cards} onDeepPractice={onDeepPractice} />));
        fireEvent.click(screen.getByLabelText('Next card'));
        fireEvent.click(screen.getByText('Practice this word'));
        expect(onDeepPractice).toHaveBeenCalledWith(cards[1]);
    });
});
