import './App.css';
import {Box} from "@chakra-ui/react";
import '@aws-amplify/ui-react/styles.css';
import {Route, Routes} from 'react-router-dom';
import Home from './components/Home.jsx';
import Practice from "./components/practice/Practice.jsx";
import VocabularyPage from "./components/vocabulary/VocabularyPage.jsx";
import Header from "./components/Header.jsx";
import {Amplify} from "aws-amplify";
import awsConfig from "./aws-exports.js";
import {fetchAuthSession} from 'aws-amplify/auth';
import {Authenticator} from "@aws-amplify/ui-react";
import {useEffect, useState} from "react";

Amplify.configure(awsConfig);

function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        async function getToken() {
            try {
                const session = await fetchAuthSession();
                const token = session.tokens?.idToken?.toString() || ''
                setToken(token);
            } catch (error) {
                console.error('Failed to fetch auth session:', error);
            }
        }

        getToken();
    }, []);

    return (
        <Authenticator signUpAttributes={["email"]}>
            {({signOut, user}) => (
                <Box className="centered" p={4}>
                    <Header user={user} signOut={signOut}/>

                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/vocabulary" element={<VocabularyPage/>}/>
                        <Route path="/practice" element={<Practice/>}/>
                    </Routes>
                </Box>
            )}
        </Authenticator>
    );
}

export default App
