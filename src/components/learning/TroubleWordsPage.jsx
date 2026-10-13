import React, {useEffect, useState} from 'react';
import {
    Alert, Badge, Box, Button, HStack, Heading, Spinner, Text, VStack
} from "@chakra-ui/react";
import {getTroubleWords} from "../../services/vocabularyService.js";
import {getWordCards} from "../../services/ai/aiService.js";
import DeepPractice from "./DeepPractice.jsx";

export default function TroubleWordsPage({hskLevel}) {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [deepPracticeCard, setDeepPracticeCard] = useState(null);
    const [loadingWord, setLoadingWord] = useState(null);
    const [cardError, setCardError] = useState(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await getTroubleWords(10);
            setWords(data.words);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDeepPractice = async (word) => {
        setLoadingWord(word);
        setCardError(null);
        try {
            const data = await getWordCards([word], hskLevel);
            setDeepPracticeCard(data.cards[0]);
        } catch {
            setCardError(word);
        } finally {
            setLoadingWord(null);
        }
    };

    if (deepPracticeCard) {
        return (
            <DeepPractice
                card={deepPracticeCard}
                hskLevel={hskLevel}
                onClose={() => setDeepPracticeCard(null)}
            />
        );
    }

    if (loading) {
        return (
            <Box py={12} textAlign="center">
                <Spinner size="lg" colorPalette="teal"/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box py={12} textAlign="center">
                <VStack gap={4} align="center">
                    <Text color="red.500">Failed to load trouble words.</Text>
                    <Button colorPalette="teal" onClick={load}>Try again</Button>
                </VStack>
            </Box>
        );
    }

    return (
        <VStack gap={6} align="stretch">
            <Heading fontSize="xl" fontWeight="semibold">Trouble Words</Heading>

            {words.length === 0 ? (
                <Box py={12} textAlign="center">
                    <Text color="gray.500">No trouble words yet. Keep practising!</Text>
                </Box>
            ) : (
                <VStack gap={3} align="stretch">
                    {words.map((w) => (
                        <Box key={w.word}>
                            <Box
                                bg="white"
                                p={4}
                                borderWidth="1px"
                                borderColor="gray.200"
                                borderRadius="xl"
                                boxShadow="sm"
                            >
                                <HStack justify="space-between" align="center">
                                    <HStack gap={3} align="center">
                                        <Text fontSize="2xl" fontWeight="bold">{w.word}</Text>
                                        <Badge colorPalette="red" size="sm">
                                            {w.failure_count} {w.failure_count === 1 ? 'fail' : 'fails'}
                                        </Badge>
                                    </HStack>
                                    <Button
                                        size="sm"
                                        colorPalette="teal"
                                        onClick={() => handleDeepPractice(w.word)}
                                        disabled={loadingWord !== null}
                                    >
                                        {loadingWord === w.word
                                            ? <><Spinner size="sm" mr={2}/>Loading...</>
                                            : "Practice"
                                        }
                                    </Button>
                                </HStack>
                            </Box>
                            {cardError === w.word && (
                                <Alert.Root status="error" size="sm" mt={1} borderRadius="md">
                                    <Alert.Indicator/>
                                    <Alert.Description>Failed to load word. Please try again.</Alert.Description>
                                </Alert.Root>
                            )}
                        </Box>
                    ))}
                </VStack>
            )}
        </VStack>
    );
}
