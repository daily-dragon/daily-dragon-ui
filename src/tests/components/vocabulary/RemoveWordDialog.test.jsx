import React from "react";
import {render, fireEvent, screen, waitFor} from "@testing-library/react";
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {RemoveWordDialog} from "../../../components/vocabulary/RemoveWordDialog.jsx";

jest.mock("../../../services/vocabularyService.js", () => ({
    deleteWord: jest.fn(() => Promise.resolve({ok: true, json: () => Promise.resolve({message: "Word deleted successfully"})})),
}));

test("allows removing a word through dialog workflow", async () => {
    render(
        <ChakraProvider value={defaultSystem}>
            <RemoveWordDialog word="学习" onDelete={jest.fn()}/>
        </ChakraProvider>
    );

    fireEvent.click(screen.getByTitle("Remove word"));

    const removeButton = await screen.findByRole("button", {name: /remove/i});
    expect(removeButton).not.toBeDisabled();

    fireEvent.click(removeButton);

    await waitFor(() => {
        expect(screen.queryByText(/Do you want to remove word "学习"\?/i)).toBeNull();
    });

    const {deleteWord} = require("../../../services/vocabularyService.js");
    expect(deleteWord).toHaveBeenCalledWith("学习");
});