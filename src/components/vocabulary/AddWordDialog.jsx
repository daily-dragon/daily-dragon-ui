import React from "react";

import {Button, CloseButton, Dialog, Input, useDialogContext} from "@chakra-ui/react"
import {useState} from "react";
import {addWord} from "../../services/vocabularyService.js";

function AddWordDialogContent({word, setWord, loading, setLoading}) {
    const dialog = useDialogContext();

    const handleSave = async () => {
        const trimmedWord = word.trim();
        if (!trimmedWord) return;
        setLoading(true);
        try {
            const response = await addWord(trimmedWord);
            if (response.ok) {
                dialog.onClose();
                setWord("");
            } else {
                // handle error
            }
        } catch (err) {
            // handle error
        }
        setLoading(false);
    };

    return (
        <>
            <Dialog.CloseTrigger asChild>
                <CloseButton/>
            </Dialog.CloseTrigger>
            <Dialog.Header>
                <Dialog.Title>Add New Word</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <Input
                    placeholder="Enter new word"
                    value={word}
                    onChange={e => setWord(e.target.value)}
                />
            </Dialog.Body>
            <Dialog.Footer>
                <Button
                    colorScheme="blue"
                    onClick={handleSave}
                    isDisabled={word.trim() === "" || loading}
                    isLoading={loading}
                >
                    Save
                </Button>
            </Dialog.Footer>
        </>
    );
}

export function AddWordDialog() {
    const [word, setWord] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button variant="subtle" title="Add new word" mb={4}>Add word</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop/>
            <Dialog.Positioner>
                <Dialog.Content>
                    <AddWordDialogContent
                        word={word}
                        setWord={setWord}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}
