import {Button, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <VStack spacing={4} mt={4}>
                <Button onClick={() => navigate("/vocabulary")}>Vocabulary</Button>
                <Button onClick={() => navigate("/practice")}>Practice</Button>
            </VStack>
        </>
    )
}
