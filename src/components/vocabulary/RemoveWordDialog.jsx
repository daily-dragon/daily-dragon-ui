import {Button, CloseButton, Dialog} from "@chakra-ui/react"
import {toaster} from "../ui/toaster"
import {deleteWord} from "../../services/vocabularyService.js";
import {useState} from "react";

export function RemoveWordDialog({word, onDeleted}) {
    const [removeButtonDisabled, setRemoveButtonDisabled] = useState(false);

    const handleDelete = async () => {
        setRemoveButtonDisabled(true)
        try {
            const response = await deleteWord(word);
            if (response.ok) {
                const json = await response.json();
                toaster.create({
                    title: json.message,
                    type: "success",
                });
            }
        } catch (e) {
            const message = "Error deleting word:"
            console.error(message, e);
            toaster.create({
                title: message,
                type: "error"
            })
        } finally {
            onClose();
            setRemoveButtonDisabled(false);
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button size="xs" variant="ghost" color="red" title="Remove word">x</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop/>
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Remove Word</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        Do you want to remove word "{word}"?
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button colorPalette="red" variant="subtle" onClick={handleDelete}
                                disabled={removeButtonDisabled}>Remove</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton/>
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}
