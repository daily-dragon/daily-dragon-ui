import {DAILY_DRAGON_API_BASE_URL} from "../config.js";
import {getToken} from "./auth.js";

export async function getDueVocabulary() {
    const headers = new Headers();
    headers.set('Authorization', "Bearer " + await getToken());
    const response = await fetch(`${DAILY_DRAGON_API_BASE_URL}/vocabulary/due`, {headers});
    if (!response.ok) throw new Error('Failed to fetch vocabulary data');
    const data = await response.json();
    return data.due_words.map(item => item.word);
}

export async function submitReviews(reviews) {
    const response = await fetch(`${DAILY_DRAGON_API_BASE_URL}/vocabulary/reviews`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + await getToken(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({reviews})
    });
    if (!response.ok) throw new Error('Failed to submit reviews');
}

export async function getTroubleWords(limit = 10) {
    const headers = new Headers();
    headers.set('Authorization', "Bearer " + await getToken());
    const response = await fetch(`${DAILY_DRAGON_API_BASE_URL}/vocabulary/trouble-words?limit=${limit}`, {headers});
    if (!response.ok) throw new Error('Failed to fetch trouble words');
    return await response.json();
}
