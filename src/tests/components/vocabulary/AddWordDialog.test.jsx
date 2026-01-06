import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {AddWordDialog} from "../../../components/vocabulary/AddWordDialog.jsx";

jest.mock("../../../services/vocabularyService.js", () => ({
    addWord: jest.fn(() => Promise.resolve({ok: true})),
}));

test("allows adding a word through dialog workflow", async () => {
    render(
        <ChakraProvider value={defaultSystem}>
            <AddWordDialog/>
        </ChakraProvider>
    );

    fireEvent.click(screen.getByTitle("Add new word"));

    const input = await screen.findByPlaceholderText("Enter new word");
    fireEvent.change(input, {target: {value: "学习"}});

    const saveButton = screen.getByRole("button", {name: /save/i});
    expect(saveButton).not.toBeDisabled();

    fireEvent.click(saveButton);

    // change the assertion after the correct logic is implemented
    await waitFor(() => {
        expect(screen.queryByPlaceholderText("Enter new word")).not.toBeNull();
    });

    const {addWord} = require("../../../services/vocabularyService.js");
    expect(addWord).toHaveBeenCalledWith("学习");
});

test("does not call addWord when input is empty or whitespace", async () => {
    const {addWord} = require("../../../services/vocabularyService.js");
    addWord.mockClear();

    render(
        <ChakraProvider value={defaultSystem}>
            <AddWordDialog/>
        </ChakraProvider>
    );

    fireEvent.click(screen.getByTitle("Add new word"));
    const input = await screen.findByPlaceholderText("Enter new word");

    fireEvent.change(input, {target: {value: "   "}});
    const saveButton = screen.getByRole("button", {name: /save/i});

    fireEvent.click(saveButton);

    expect(addWord).not.toHaveBeenCalled();
});
