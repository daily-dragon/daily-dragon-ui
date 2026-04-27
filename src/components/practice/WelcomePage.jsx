import {Button, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";

export default function WelcomePage({onStart}) {
    const navigate = useNavigate();
    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}><FiArrowLeft/> Home</Button>
            <Text>From here you can start practicing translating Chinese sentences</Text>
            <Button colorPalette="blue" variant="subtle" onClick={onStart}>Start</Button>
        </>
    );
}
