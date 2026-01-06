import React from "react";

import {Button, CloseButton, Dialog, Input, useDialogContext} from "@chakra-ui/react"
import {useState} from "react";
import {addWord} from "../../services/vocabularyService.js";
import {toaster} from "../ui/toaster.jsx";

function AddWordDialogContent({setIsOpen, onAdd}) {
    const dialog = useDialogContext();

    const [word, setWord] = useState("");
    const [adding, setAdding] = useState(false);

    const handleSave = async () => {
        const trimmedWord = word.trim();
        if (!trimmedWord) return;
        setAdding(true);
        try {
            const response = await addWord(trimmedWord);
            if (response.ok) {
                const json = await response.json();
                toaster.create({
                    title: json.message,
                    type: "success",
                });
                setIsOpen(false);
                setWord("");
                onAdd();
            } else {
                const json = await response.json();
                toaster.create({
                    title: json.detail,
                    type: "error"
                })
            }
        } catch (e) {
            console.error(e);
            toaster.create({
                title: e,
                type: "error"
            })
        } finally {
            setAdding(false);
        }
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
                    disabled={!word.trim() || adding}
                >
                    Save
                </Button>
            </Dialog.Footer>
        </>
    );
}

export function AddWordDialog({onAdd}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(details) => setIsOpen(details.open)}
            role="alertdialog"
        >
            <Dialog.Trigger asChild>
                <Button variant="subtle" title="Add new word" mb={4}>Add word</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop/>
            <Dialog.Positioner>
                <Dialog.Content>
                    <AddWordDialogContent setIsOpen={setIsOpen} onAdd={onAdd}/>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}
