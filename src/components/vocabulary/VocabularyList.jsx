import React, {useState} from "react";
import {RemoveWordDialog} from "./RemoveWordDialog.jsx";
import {
    SimpleGrid,
    Box,
    Text,
    Button,
    HStack,
} from "@chakra-ui/react";

const PAGE_SIZE = 10;

export function VocabularyList({items, onDelete}) {
    const [page, setPage] = useState(0);

    const start = page * PAGE_SIZE;
    const pageItems = items.slice(start, start + PAGE_SIZE);
    const pageCount = Math.ceil(items.length / PAGE_SIZE);

    return (
        <>
            <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
                {pageItems.map((item, index) => (
                    <Box
                        key={start + index}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        textAlign="center"
                        m={2}
                    >
                        <Text>{item}</Text>
                        <RemoveWordDialog
                            word={item}
                            onDelete={onDelete}
                            style={{position: "absolute", top: 2, right: 2}}
                        />
                    </Box>
                ))}
            </SimpleGrid>

            <HStack mt={4} justify="center">
                <Button
                    variant="ghost"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 0}
                >
                    ◀
                </Button>

                <Text>
                    {page + 1} / {pageCount}
                </Text>

                <Button
                    variant="ghost"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === pageCount - 1}
                >
                    ▶
                </Button>
            </HStack>
        </>
    );
}
