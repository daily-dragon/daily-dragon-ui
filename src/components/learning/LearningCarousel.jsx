import React from 'react';
import {Box, Button, HStack, Text, VStack} from "@chakra-ui/react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";
import WordCard from "./WordCard.jsx";

export default function LearningCarousel({cards, onDeepPractice}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const total = cards.length;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === total - 1;

    return (
        <VStack gap={6} align="stretch">
            <HStack justify="space-between" align="center">
                <Button variant="ghost" size="sm" colorPalette="gray" onClick={() => navigate("/learning")}>
                    Back
                </Button>
                <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    {currentIndex + 1} / {total}
                </Text>
                <Box w="60px"/>
            </HStack>

            <WordCard card={cards[currentIndex]}/>

            <Box textAlign="center">
                <Button
                    variant="subtle"
                    size="sm"
                    colorPalette="teal"
                    onClick={() => onDeepPractice(cards[currentIndex])}
                >
                    Practice this word
                </Button>
            </Box>

            <HStack justify="space-between" align="center">
                {isFirst ? (
                    <Box/>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        colorPalette="teal"
                        aria-label="Previous card"
                        onClick={() => setCurrentIndex(i => i - 1)}
                    >
                        <FiArrowLeft/> Previous
                    </Button>
                )}

                {isLast ? (
                    <Button colorPalette="teal" onClick={() => navigate("/practice")}>
                        Practice these words now
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        colorPalette="teal"
                        aria-label="Next card"
                        onClick={() => setCurrentIndex(i => i + 1)}
                    >
                        Next <FiArrowRight/>
                    </Button>
                )}
            </HStack>
        </VStack>
    );
}
