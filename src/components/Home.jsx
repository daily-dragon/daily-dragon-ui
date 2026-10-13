import {Box, Heading, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {FiBarChart2, FiEdit, FiBook, FiTarget} from "react-icons/fi";

export default function Home() {
    return (
        <VStack gap={8} mt={8} align="stretch">
            <Heading fontSize="lg" fontWeight="semibold" color="gray.500" textAlign="center">
                What would you like to do?
            </Heading>
            <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                <Link to="/progress" style={{textDecoration: "none"}}>
                    <Box
                        p={6}
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="xl"
                        boxShadow="sm"
                        _hover={{boxShadow: "md", borderColor: "teal.300"}}
                        transition="all 0.15s"
                        cursor="pointer"
                    >
                        <VStack align="flex-start" gap={2}>
                            <Box color="teal.500" fontSize="2xl"><FiBarChart2/></Box>
                            <Text fontWeight="semibold" fontSize="lg">Progress</Text>
                            <Text fontSize="sm" color="gray.500">View your HSK level progress</Text>
                        </VStack>
                    </Box>
                </Link>
                <Link to="/practice" style={{textDecoration: "none"}}>
                    <Box
                        p={6}
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="xl"
                        boxShadow="sm"
                        _hover={{boxShadow: "md", borderColor: "teal.300"}}
                        transition="all 0.15s"
                        cursor="pointer"
                    >
                        <VStack align="flex-start" gap={2}>
                            <Box color="teal.500" fontSize="2xl"><FiEdit/></Box>
                            <Text fontWeight="semibold" fontSize="lg">Practice</Text>
                            <Text fontSize="sm" color="gray.500">Translate sentences with your words</Text>
                        </VStack>
                    </Box>
                </Link>
                <Link to="/learning" style={{textDecoration: "none"}}>
                    <Box
                        p={6}
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="xl"
                        boxShadow="sm"
                        _hover={{boxShadow: "md", borderColor: "teal.300"}}
                        transition="all 0.15s"
                        cursor="pointer"
                    >
                        <VStack align="flex-start" gap={2}>
                            <Box color="teal.500" fontSize="2xl"><FiBook/></Box>
                            <Text fontWeight="semibold" fontSize="lg">Learn</Text>
                            <Text fontSize="sm" color="gray.500">Study your due words before practicing</Text>
                        </VStack>
                    </Box>
                </Link>
                <Link to="/trouble-words" style={{textDecoration: "none"}}>
                    <Box
                        p={6}
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="xl"
                        boxShadow="sm"
                        _hover={{boxShadow: "md", borderColor: "teal.300"}}
                        transition="all 0.15s"
                        cursor="pointer"
                    >
                        <VStack align="flex-start" gap={2}>
                            <Box color="teal.500" fontSize="2xl"><FiTarget/></Box>
                            <Text fontWeight="semibold" fontSize="lg">Trouble Words</Text>
                            <Text fontSize="sm" color="gray.500">Drill the words you keep getting wrong</Text>
                        </VStack>
                    </Box>
                </Link>
            </SimpleGrid>
        </VStack>
    );
}
