import {
    Box, Button, Text, SimpleGrid, HStack, VStack,
    Card, Stat, Badge, ProgressCircle, Alert, Separator
} from "@chakra-ui/react";

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

export default ({review, onFinish}) => {
    const avg = (review.reduce((sum, r) => sum + r.score, 0) / review.length).toFixed(1);
    const excellent = review.filter(r => r.score >= 8).length;
    const needsWork = review.filter(r => r.score < 6).length;

    return (
        <VStack gap={6} align="stretch">
            <HStack gap={8} p={5} bg="gray.50" borderRadius="lg" justify="center" flexWrap="wrap">
                <Stat.Root textAlign="center">
                    <Stat.Label>Average Score</Stat.Label>
                    <Stat.ValueText>{avg} <Text as="span" fontSize="sm" color="gray.500">/ 10</Text></Stat.ValueText>
                </Stat.Root>
                <Stat.Root textAlign="center">
                    <Stat.Label>Excellent</Stat.Label>
                    <Stat.ValueText color="green.500">{excellent}</Stat.ValueText>
                    <Stat.HelpText>score ≥ 8</Stat.HelpText>
                </Stat.Root>
                <Stat.Root textAlign="center">
                    <Stat.Label>Needs Work</Stat.Label>
                    <Stat.ValueText color="red.500">{needsWork}</Stat.ValueText>
                    <Stat.HelpText>score &lt; 6</Stat.HelpText>
                </Stat.Root>
            </HStack>

            <SimpleGrid columns={{base: 1, md: 2}} gap={5}>
                {review.map((r, i) => (
                    <Card.Root key={i} borderRadius="lg" boxShadow="md">
                        <Card.Header>
                            <HStack justify="space-between" align="flex-start" gap={3}>
                                <VStack align="flex-start" gap={1} flex={1}>
                                    <HStack gap={2} align="baseline">
                                        <Text fontWeight="bold" fontSize="2xl">{r.targetWord}</Text>
                                        {r['target_word_pinyin'] && (
                                            <Text fontSize="md" color="purple.500">{r['target_word_pinyin']}</Text>
                                        )}
                                    </HStack>
                                    <HStack gap={1}>
                                        <Text fontSize="xs" color="gray.500">you used:</Text>
                                        <Text fontSize="sm" fontWeight="semibold"
                                              color={r.wordUsed === r.targetWord ? "green.600" : "orange.600"}>
                                            {r.wordUsed}
                                        </Text>
                                    </HStack>
                                </VStack>
                                <ProgressCircle.Root
                                    value={(r.score / 10) * 100}
                                    size="sm"
                                    colorPalette={scoreColor(r.score)}
                                    flexShrink={0}
                                >
                                    <ProgressCircle.Circle>
                                        <ProgressCircle.Track/>
                                        <ProgressCircle.Range/>
                                    </ProgressCircle.Circle>
                                </ProgressCircle.Root>
                            </HStack>
                        </Card.Header>

                        <Card.Body gap={3}>
                            <Text fontSize="sm" color="gray.600" fontStyle="italic">{r.originalSentence}</Text>

                            <Separator/>

                            <Box>
                                <Text fontSize="xs" color="gray.500" fontWeight="semibold" mb={1}>Your translation</Text>
                                <Text fontSize="sm">{r.userTranslation}</Text>
                            </Box>

                            <Box p={2} bg="green.subtle" borderRadius="md">
                                <Text fontSize="xs" color="green.fg" fontWeight="semibold" mb={1}>Correct sentence</Text>
                                <Text fontSize="sm">{r.correctSentence}</Text>
                            </Box>

                            <Alert.Root status={scoreAlertStatus(r.score)} size="sm" borderRadius="md">
                                <Alert.Indicator/>
                                <Alert.Description>{r.feedback}</Alert.Description>
                            </Alert.Root>
                        </Card.Body>

                        <Card.Footer>
                            <Badge colorPalette={scoreColor(r.score)} size="lg">{r.score} / 10</Badge>
                        </Card.Footer>
                    </Card.Root>
                ))}
            </SimpleGrid>

            <HStack justify="center">
                <Button colorPalette="blue" variant="subtle" onClick={onFinish}>
                    Finish Practice
                </Button>
            </HStack>
        </VStack>
    );
};
