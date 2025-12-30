import {fetchAuthSession} from "aws-amplify/auth";
import {DAILY_DRAGON_API_BASE_URL} from "../config.js";

const VOCABULARY_URL = DAILY_DRAGON_API_BASE_URL + '/vocabulary';

const getToken = async () => {
    const session = await fetchAuthSession();
    return session.tokens.idToken.toString();
};

const fetchVocabularyData = async (url) => {
    const headers = new Headers()
    headers.set('Authorization', "Bearer " + await getToken());

    const response = await fetch(url, {headers});
    if (!response.ok) {
        throw new Error('Failed to fetch vocabulary data');
    }
    const data = await response.json();
    return Object.keys(data);
};

export async function fetchVocabulary() {
    return fetchVocabularyData(VOCABULARY_URL);
}

export async function getRandomNWords(n) {
    return fetchVocabularyData(`${VOCABULARY_URL}?count=${n}`);
}

export async function addWord(trimmedWord) {
    return await fetch(VOCABULARY_URL, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + await getToken(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({word: trimmedWord}),
    });
}

export async function deleteWord(word) {
    return await fetch(`${VOCABULARY_URL}/${encodeURIComponent(word)}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + await getToken(),
        },
    });
}
