import {fetchAuthSession} from "aws-amplify/auth";

export const getToken = async () => {
    const session = await fetchAuthSession();
    return session.tokens.idToken.toString();
};

