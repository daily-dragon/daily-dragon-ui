import {Heading, Text, HStack, Box, IconButton, Flex} from "@chakra-ui/react";
import {FiLogOut} from "react-icons/fi";
import {Link} from "react-router-dom";

export default function Header({user, signOut}) {
    return (
        <Flex width="100%" align="center" py={3}>
            <Box flex={1}/>
            <Link to="/" style={{textDecoration: "none"}}>
                <Heading size="2xl" colorPalette="blue">每日龙</Heading>
            </Link>
            <Box flex={1}>
                <HStack justify="flex-end">
                    <Text fontSize="sm">
                        Welcome <Box as="span" fontWeight="bold">{user.username}</Box>
                    </Text>
                    <IconButton size="sm" onClick={signOut} colorPalette="blue" variant="outline">
                        <FiLogOut/>
                    </IconButton>
                </HStack>
            </Box>
        </Flex>
    );
}
