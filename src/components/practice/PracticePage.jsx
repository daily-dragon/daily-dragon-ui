import React from 'react';
import {
    Box, Button, Input, List, Spinner, Text,
    DialogRoot, DialogContent, DialogHeader,
    DialogBody, DialogFooter, DialogTitle, DialogActionTrigger
} from "@chakra-ui/react";
import {getDueVocabulary, submitReviews} from "../../services/vocabularyService.js";
import {useState, useEffect} from "react";
import {getPracticeSentences, submitTranslations} from "../../services/ai/aiService.js";

export function PracticePage({onReview}) {
    const [gettingSentences, setGettingSentences] = useState(true);
    const [words, setWords] = useState([]);
    const [sentences, setSentences] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const words = await getDueVocabulary();
            setWords(words);

            let sentencesResult = await getPracticeSentences(words);

            if (typeof sentencesResult === 'string') {
                try {
                    sentencesResult = JSON.parse(sentencesResult);
                } catch (e) {
                    console.error('Failed to parse sentences response:', e);
                }
            }

            let sentencesArray = [];
            if (Array.isArray(sentencesResult)) {
                sentencesArray = sentencesResult;
            } else if (sentencesResult && Array.isArray(sentencesResult.sentences)) {
                sentencesArray = sentencesResult.sentences.map(s => s.sentence || s);

                const returnedWords = sentencesResult.sentences.map(s => s.word).filter(Boolean);
                if (returnedWords.length === sentencesArray.length) {
                    setWords(returnedWords);
                }
            }

            setSentences(sentencesArray);
            setTranslations(Array(sentencesArray.length).fill(""));
            setGettingSentences(false);
        })();
    }, []);

    const handleInputChange = (index, value) => {
        setTranslations((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const hasEmpty = Array.isArray(translations) && translations.some((t) => (t || "").trim() === "");

    const doSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = sentences.map((sentence, i) => ({
                word: words[i],
                sentence,
                translation: translations[i]
            }));
            const review = await submitTranslations({translations: payload});
            await submitReviews(review.map(r => ({word: r.targetWord, quality: r.score})));
            onReview(review);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (hasEmpty) {
            setConfirmOpen(true);
        } else {
            doSubmit();
        }
    };

    return (
        <>
            {gettingSentences ? (<>
                <Text>Getting sentences for translation...</Text>
                <Spinner/>
            </>) : (<>
                <Text>Translate the following sentences into Chinese using the correct translation of the underlined word.</Text>
                <Box m="6px">
                    <List.Root as="ol">
                        {sentences.map((sentence, index) => (
                            <List.Item key={index}>{sentence}
                                <Input
                                    value={translations[index]}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                />
                            </List.Item>
                        ))}
                    </List.Root>
                </Box>
                <Button colorPalette="blue" variant="subtle" onClick={handleSubmit}
                        disabled={submitting}>Submit</Button>
                {submitting ? (<>
                    <Text>Submitting your translations...</Text>
                    <Spinner/>
                </>) : null}

                <DialogRoot open={confirmOpen} onOpenChange={(e) => setConfirmOpen(e.open)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Incomplete translations</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <Text>You've left some translations blank. Submit anyway?</Text>
                        </DialogBody>
                        <DialogFooter>
                            <DialogActionTrigger asChild>
                                <Button variant="outline">Go back</Button>
                            </DialogActionTrigger>
                            <Button colorPalette="blue" onClick={() => { setConfirmOpen(false); doSubmit(); }}>Submit</Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogRoot>
            </>)
            }
        </>);
}
