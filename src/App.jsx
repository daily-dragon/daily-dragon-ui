import './App.css';
import {Box} from "@chakra-ui/react";
import '@aws-amplify/ui-react/styles.css';
import {Route, Routes} from 'react-router-dom';
import Home from './components/Home.jsx';
import Practice from "./components/practice/Practice.jsx";
import ProgressPage from "./components/progress/ProgressPage.jsx";
import Header from "./components/Header.jsx";
import Learning from "./components/learning/Learning.jsx";
import TroubleWordsPage from "./components/learning/TroubleWordsPage.jsx";
import {Amplify} from "aws-amplify";
import awsConfig from "./aws-exports.js";
import {Authenticator} from "@aws-amplify/ui-react";
import {useEffect, useState} from "react";
import {getSettings} from "./services/settingsService.js";

Amplify.configure(awsConfig);

function App() {
    const [hskLevel, setHskLevel] = useState(null);

    useEffect(() => {
        getSettings()
            .then(s => setHskLevel(s.hsk_level))
            .catch(() => setHskLevel(1));
    }, []);

    return (
        <Authenticator signUpAttributes={["email"]}>
            {({signOut, user}) => (
                <Box bg="gray.50" minH="100vh" display="flex" flexDirection="column">
                    <Header user={user} signOut={signOut} hskLevel={hskLevel}/>
                    <Box maxW="800px" mx="auto" w="full" px={{base: 4, md: 6}} py={6} flex="1">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/progress" element={<ProgressPage/>}/>
                            <Route path="/practice" element={<Practice hskLevel={hskLevel}/>}/>
                            <Route path="/learning" element={<Learning hskLevel={hskLevel}/>}/>
                            <Route path="/trouble-words" element={<TroubleWordsPage hskLevel={hskLevel}/>}/>
                        </Routes>
                    </Box>
                </Box>
            )}
        </Authenticator>
    );
}

export default App
