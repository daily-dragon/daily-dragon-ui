import {Box, Button, Spinner, Text, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {getDueVocabulary} from "../../services/vocabularyService.js";
import {getWordCards} from "../../services/ai/aiService.js";
import LearningCarousel from "./LearningCarousel.jsx";
import DeepPractice from "./DeepPractice.jsx";

const STATES = {
    LOADING: 'LOADING',
    STUDYING: 'STUDYING',
    ERROR: 'ERROR',
};

export default function Learning({hskLevel}) {
    const [state, setState] = useState(STATES.LOADING);
    const [cards, setCards] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [deepPracticeCard, setDeepPracticeCard] = useState(null);
    const navigate = useNavigate();

    const loadCards = async () => {
        setState(STATES.LOADING);
        setErrorMsg(null);
        try {
            const words = await getDueVocabulary();
            const result = await getWordCards(words, hskLevel);
            setCards(result.cards);
            setState(STATES.STUDYING);
        } catch (err) {
            setErrorMsg(err.message || "Something went wrong.");
            setState(STATES.ERROR);
        }
    };

    useEffect(() => {
        loadCards();
    }, []);

    if (state === STATES.LOADING) {
        return (
            <Box py={12} textAlign="center">
                <Spinner size="lg" colorPalette="teal"/>
                <Text mt={4} color="gray.500">Preparing your word cards...</Text>
            </Box>
        );
    }

    if (state === STATES.ERROR) {
        return (
            <Box py={12} textAlign="center">
                <VStack gap={4} align="center">
                    <Text color="red.500">{errorMsg}</Text>
                    <Button colorPalette="teal" onClick={loadCards}>Try again</Button>
                    <Button variant="ghost" size="sm" colorPalette="teal" onClick={() => navigate("/")}>
                        <FiArrowLeft/> Back
                    </Button>
                </VStack>
            </Box>
        );
    }

    return (
        <VStack gap={6} align="stretch">
            <Box>
                <Button variant="ghost" size="sm" colorPalette="teal" onClick={() => navigate("/")}>
                    <FiArrowLeft/> Home
                </Button>
            </Box>
            {deepPracticeCard ? (
                <DeepPractice
                    card={deepPracticeCard}
                    hskLevel={hskLevel}
                    onClose={() => setDeepPracticeCard(null)}
                />
            ) : (
                <LearningCarousel cards={cards} onDeepPractice={setDeepPracticeCard}/>
            )}
        </VStack>
    );
}
