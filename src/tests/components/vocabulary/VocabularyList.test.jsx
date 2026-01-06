jest.mock("../../../components/vocabulary/RemoveWordDialog.jsx",
    () => ({
        RemoveWordDialog: () => <div/>,
    })
);
jest.mock("../../../components/vocabulary/AddWordDialog.jsx",
    () => ({
        AddWordDialog: () => <div/>,
    })
);

import React, {act} from "react";
import {render, screen} from "@testing-library/react";
import {VocabularyList} from "../../../components/vocabulary/VocabularyList.jsx";
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";

test("renders all words in the list", () => {
    render(
        <ChakraProvider value={defaultSystem}>
            <VocabularyList items={["你好", "世界"]}/>
        </ChakraProvider>
    );
    expect(screen.getByText("你好")).toBeInTheDocument();
    expect(screen.getByText("世界")).toBeInTheDocument();
});

test("paginates long word lists", async () => {
    const items = Array.from({length: 25}, (_, i) => `Word ${i + 1}`);
    render(
        <ChakraProvider value={defaultSystem}>
            <VocabularyList items={items}/>
        </ChakraProvider>
    );

    expect(screen.getByText("Word 1")).toBeInTheDocument();
    expect(screen.getByText("Word 10")).toBeInTheDocument();
    expect(screen.queryByText("Word 11")).not.toBeInTheDocument();

    act(() => {
        const nextButton = screen.getByText("▶");
        nextButton.click();
    });

    expect(await screen.getByText("Word 11")).toBeInTheDocument();
    expect(screen.getByText("Word 20")).toBeInTheDocument();
    expect(screen.queryByText("Word 21")).not.toBeInTheDocument();
});
