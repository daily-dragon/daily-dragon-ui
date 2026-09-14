import React, {useEffect, useState} from 'react';
import {
    Alert, Badge, Box, Button, HStack, Input,
    Separator, Spinner, Text, VStack
} from "@chakra-ui/react";
import {FiArrowLeft} from "react-icons/fi";
import {getDeepPracticeSentences, submitTranslations} from "../../services/ai/aiService.js";
import {renderSentence} from "../practice/renderSentence.jsx";
import {toaster} from "../ui/toaster.jsx";

const STATES = {
    LOADING: 'LOADING',
    PRACTICING: 'PRACTICING',
    REVIEWING: 'REVIEWING',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
};

const scoreColor = (score) => {
    if (score >= 8) return "green";
    if (score >= 5) return "orange";
    return "red";
};

const scoreAlertStatus = (score) => {
    if (score >= 8) return "success";
    if (score >= 5) return "warning";
    return "error";
};

export default function DeepPractice({card, hskLevel, onClose}) {
    const [state, setState] = useState(STATES.LOADING);
    const [sentences, setSentences] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [translation, setTranslation] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [results, setResults] = useState([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setState(STATES.LOADING);
        try {
            const data = await getDeepPracticeSentences(card.word, hskLevel);
            setSentences(data.sentences);
            setCurrentIndex(0);
            setTranslation('');
            setResults([]);
            setState(STATES.PRACTICING);
        } catch {
            setState(STATES.ERROR);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const current = sentences[currentIndex];
            const review = await submitTranslations([{
                word: card.word,
                sentence: current.sentence,
                translation
            }]);
            setCurrentReview(review[0]);
            setResults(prev => [...prev, review[0]]);
            setState(STATES.REVIEWING);
        } catch {
            toaster.create({
                title: 'Submission failed',
                description: 'Could not evaluate translation. Please try again.',
                type: 'error',
                closable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 >= sentences.length) {
            setState(STATES.COMPLETE);
        } else {
            setCurrentIndex(i => i + 1);
            setTranslation('');
            setCurrentReview(null);
            setState(STATES.PRACTICING);
        }
    };

    if (state === STATES.LOADING) {
        return (
            <Box py={12} textAlign="center">
                <Spinner size="lg" colorPalette="teal"/>
                <Text mt={4} color="gray.500">Generating sentences for {card.word}...</Text>
            </Box>
        );
    }

    if (state === STATES.ERROR) {
        return (
            <Box py={12} textAlign="center">
                <VStack gap={4} align="center">
                    <Text color="red.500">Failed to load practice sentences.</Text>
                    <Button colorPalette="teal" onClick={load}>Try again</Button>
                    <Button variant="ghost" size="sm" colorPalette="teal" onClick={onClose}>
                        <FiArrowLeft/> Back to cards
                    </Button>
                </VStack>
            </Box>
        );
    }

    if (state === STATES.COMPLETE) {
        const avg = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1);
        return (
            <VStack gap={6} align="stretch">
                <HStack>
                    <Button variant="ghost" size="sm" colorPalette="teal" onClick={onClose}>
                        <FiArrowLeft/> Back to cards
                    </Button>
                </HStack>

                <Box textAlign="center">
                    <Text fontSize="5xl" fontWeight="bold">{card.word}</Text>
                    <Text color="purple.500" fontSize="lg">{card.pinyin}</Text>
                    <Text color="gray.500" mt={1} fontSize="sm">Deep Practice Complete</Text>
                    <Text fontSize="2xl" fontWeight="semibold" mt={2}>{avg} <Text as="span" fontSize="sm" color="gray.500">/ 10 avg</Text></Text>
                </Box>

                <VStack gap={4} align="stretch">
                    {results.map((r, i) => (
                        <Box key={i} bg="white" p={4} borderWidth="1px" borderColor="gray.200" borderRadius="lg" boxShadow="sm">
                            <HStack justify="space-between" mb={2}>
                                <Badge colorPalette="teal" size="sm">{sentences[i].usage_hint}</Badge>
                                <Badge colorPalette={scoreColor(r.score)}>{r.score} / 10</Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.600" fontStyle="italic" mb={2}>{renderSentence(r.originalSentence)}</Text>
                            <Separator mb={2}/>
                            <Text fontSize="xs" color="gray.500" fontWeight="semibold">Your translation</Text>
                            <Text fontSize="sm" mb={2}>{r.userTranslation}</Text>
                            {r.correctSentence && (
                                <Box p={2} bg="green.subtle" borderRadius="md" mb={2}>
                                    <Text fontSize="xs" color="green.fg" fontWeight="semibold" mb={1}>Correct sentence</Text>
                                    <Text fontSize="sm">{renderSentence(r.correctSentence)}</Text>
                                </Box>
                            )}
                            <Alert.Root status={scoreAlertStatus(r.score)} size="sm" borderRadius="md">
                                <Alert.Indicator/>
                                <Alert.Description>{r.feedback}</Alert.Description>
                            </Alert.Root>
                        </Box>
                    ))}
                </VStack>
            </VStack>
        );
    }

    const current = sentences[currentIndex];
    const isLastSentence = currentIndex + 1 >= sentences.length;

    return (
        <VStack gap={6} align="stretch">
            <HStack justify="space-between" align="center">
                <Button variant="ghost" size="sm" colorPalette="teal" onClick={onClose}>
                    <FiArrowLeft/> Back
                </Button>
                <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    {currentIndex + 1} / {sentences.length}
                </Text>
                <Box w="60px"/>
            </HStack>

            <Box textAlign="center">
                <Text fontSize="5xl" fontWeight="bold">{card.word}</Text>
                <Text color="purple.500" fontSize="lg">{card.pinyin}</Text>
            </Box>

            <Box bg="white" p={5} borderWidth="1px" borderColor="gray.200" borderRadius="lg" boxShadow="sm">
                <HStack mb={3}>
                    <Badge colorPalette="teal" size="sm">{current.usage_hint}</Badge>
                </HStack>
                <Text mb={4}>{renderSentence(current.sentence)}</Text>

                {state === STATES.PRACTICING ? (
                    <VStack gap={3} align="stretch">
                        <Input
                            placeholder="Translate into Chinese..."
                            value={translation}
                            onChange={e => setTranslation(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !submitting && translation.trim() && handleSubmit()}
                        />
                        <Button
                            colorPalette="teal"
                            onClick={handleSubmit}
                            disabled={submitting || !translation.trim()}
                        >
                            {submitting ? <><Spinner size="sm" mr={2}/>Checking...</> : "Check"}
                        </Button>
                    </VStack>
                ) : (
                    <VStack gap={3} align="stretch">
                        <Separator/>
                        <Box>
                            <Text fontSize="xs" color="gray.500" fontWeight="semibold" mb={1}>Your translation</Text>
                            <Text fontSize="sm">{currentReview.userTranslation}</Text>
                        </Box>
                        {currentReview.correctSentence && (
                            <Box p={2} bg="green.subtle" borderRadius="md">
                                <Text fontSize="xs" color="green.fg" fontWeight="semibold" mb={1}>Correct sentence</Text>
                                <Text fontSize="sm">{renderSentence(currentReview.correctSentence)}</Text>
                            </Box>
                        )}
                        <Alert.Root status={scoreAlertStatus(currentReview.score)} size="sm" borderRadius="md">
                            <Alert.Indicator/>
                            <Alert.Description>{currentReview.feedback}</Alert.Description>
                        </Alert.Root>
                        <HStack justify="space-between">
                            <Badge colorPalette={scoreColor(currentReview.score)} size="lg">
                                {currentReview.score} / 10
                            </Badge>
                            <Button colorPalette="teal" size="sm" onClick={handleNext}>
                                {isLastSentence ? "See Results" : "Next"}
                            </Button>
                        </HStack>
                    </VStack>
                )}
            </Box>
        </VStack>
    );
}
