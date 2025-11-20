import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')).render(
    <ChakraProvider value={defaultSystem}>
        <BrowserRouter basename="/daily-dragon">
            <App/>
        </BrowserRouter>
    </ChakraProvider>
)
