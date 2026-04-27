import {Box} from "@chakra-ui/react";
import {useState} from "react";
import WelcomePage from "./WelcomePage.jsx";
import {PracticePage} from "./PracticePage.jsx";
import ReviewPage from "./ReviewPage.jsx";

const STATES = {
    WELCOME: 'WELCOME',
    IN_PROGRESS: 'IN_PROGRESS',
    REVIEW: 'REVIEW'
}

export default function Practice() {
    const [state, setState] = useState(STATES.WELCOME);
    const [reviewResult, setReviewResult] = useState(null);

    const startPractice = () => setState(STATES.IN_PROGRESS);
    const goToReview = (reviewData) => {
        setReviewResult(reviewData);
        setState(STATES.REVIEW);
    }
    const finishPractice = () => {
        setReviewResult(null);
        setState(STATES.WELCOME);
    }
    const practiceAgain = () => {
        setReviewResult(null);
        setState(STATES.IN_PROGRESS);
    }

    return <Box>
        {state === STATES.WELCOME && <WelcomePage onStart={startPractice}/>}
        {state === STATES.IN_PROGRESS && <PracticePage onReview={goToReview}/>}
        {state === STATES.REVIEW && <ReviewPage onFinish={finishPractice} onPracticeAgain={practiceAgain} review={reviewResult}/>}
    </Box>
}
