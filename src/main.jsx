import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import {Toaster} from "./components/ui/toaster";

createRoot(document.getElementById('root')).render(
    <ChakraProvider value={defaultSystem}>
        <BrowserRouter>
            <App/>
            <Toaster/>
        </BrowserRouter>
    </ChakraProvider>
)
