import {Box, Button, Text, List} from "@chakra-ui/react";

export default ({review, onFinish}) => (
    <>
        <Text>Review Results:</Text>
        <Box mb={4}>
            <List.Root as="ol" spacing="3">
                {review.map((r, i) => (
                    <List.Item key={i}>
                        <Box
                            p={4}
                            mb={3}
                            borderWidth="1px"
                            borderRadius="md"
                            boxShadow="sm"
                            bg="gray.50"
                        >
                            <Text><strong>Sentence:</strong> {r.originalSentence}</Text>
                            <Text><strong>Your translation:</strong> {r.userTranslation}</Text>
                            <Text><strong>Target word:</strong> {r.targetWord}</Text>
                            <Text><strong>Word used:</strong> {r.wordUsed}</Text>
                            <Text><strong>Correct sentence:</strong> {r.correctSentence}</Text>
                            <Text><strong>Feedback:</strong> {r.feedback}</Text>
                            <Text><strong>Score:</strong> {r.score}/10</Text>
                        </Box>
                    </List.Item>
                ))}
            </List.Root>
        </Box>
        <Button colorPalette="blue" variant="subtle" onClick={onFinish}>
            Finish Practice
        </Button>
    </>
)
