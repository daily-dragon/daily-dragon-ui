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

import React from "react";
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
