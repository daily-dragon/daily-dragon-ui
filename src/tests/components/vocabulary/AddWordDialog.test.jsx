import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {AddWordDialog} from "../../../components/vocabulary/AddWordDialog.jsx";

jest.mock("../../../services/vocabularyService.js", () => ({
    addWord: jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({message: "Word added successfully"})
    })),
}));

test("allows adding a word through dialog workflow", async () => {
    render(
        <ChakraProvider value={defaultSystem}>
            <AddWordDialog onAdd={
                () => {
                }
            }/>
        </ChakraProvider>
    );

    fireEvent.click(screen.getByTitle("Add new word"));

    const input = await screen.findByPlaceholderText("Enter new word");
    fireEvent.change(input, {target: {value: "学习"}});

    const saveButton = screen.getByRole("button", {name: /save/i});
    expect(saveButton).not.toBeDisabled();

    fireEvent.click(saveButton);

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

test("handles API error when addWord returns ok: false", async () => {
    const {addWord} = require("../../../services/vocabularyService.js");
    addWord.mockImplementationOnce(() =>
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve({message: "Something went wrong"}),
        })
    );

    render(
        <ChakraProvider value={defaultSystem}>
            <AddWordDialog onAdd={() => {}} />
        </ChakraProvider>
    );

    fireEvent.click(screen.getByTitle("Add new word"));

    const input = await screen.findByPlaceholderText("Enter new word");
    fireEvent.change(input, {target: {value: "失败"}});

    const saveButton = screen.getByRole("button", {name: /save/i});
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(screen.getByPlaceholderText("Enter new word")).toBeInTheDocument();
    });
});

test("limits input to 256 characters", async () => {
    render(
        <ChakraProvider value={defaultSystem}>
            <AddWordDialog/>
        </ChakraProvider>
    );

    fireEvent.click(screen.getByTitle("Add new word"));
    const input = await screen.findByPlaceholderText("Enter new word");

    expect(input).toHaveAttribute("maxlength", "256");

    const longString = "a".repeat(300);
    fireEvent.change(input, {target: {value: longString}});

    expect(input.value.length).toBeLessThanOrEqual(256);
});

