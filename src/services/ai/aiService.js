import {EVALUATE_TRANSLATIONS_PROMPT} from "./prompts.js";
import {DAILY_DRAGON_API_BASE_URL} from "../../config.js";
import {getToken} from "../auth.js";

const PRACTICE_OPENAI_API_URL = DAILY_DRAGON_API_BASE_URL + "/practice";


export async function getPracticeSentences(words) {
    const response = await fetch(PRACTICE_OPENAI_API_URL + "/sentences", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + await getToken(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({words})
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
}

export async function submitTranslations(input) {
    let translationsArray = [];

    if (Array.isArray(input)) {
        translationsArray = input;
    } else if (input && Array.isArray(input.words) && Array.isArray(input.sentences) && Array.isArray(input.translations)) {
        translationsArray = input.words.map((w, i) => ({
            word: w,
            sentence: input.sentences[i],
            translation: input.translations[i]
        }));
    } else if (input && Array.isArray(input.translations)) {
        // If translations are already objects, use them. If they're strings but words/sentences are present, map them.
        if (input.translations.length > 0 && typeof input.translations[0] === 'object') {
            translationsArray = input.translations;
        } else if (Array.isArray(input.words) && Array.isArray(input.sentences)) {
            translationsArray = input.words.map((w, i) => ({
                word: w,
                sentence: input.sentences[i],
                translation: input.translations[i]
            }));
        } else {
            translationsArray = input.translations.map(t => ({ translation: t }));
        }
    } else {
        throw new Error('Invalid input for submitTranslations');
    }

    const response = await fetch(PRACTICE_OPENAI_API_URL + "/evaluate-translations", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + await getToken(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ translations: translationsArray })
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    let result = await response.json();
    if (typeof result === 'string') {
        try {
            result = JSON.parse(result);
        } catch (e) {
            console.error('Failed to parse submitTranslations response:', e);
            throw e;
        }
    }

    const evaluations = Array.isArray(result.evaluations) ? result.evaluations : (Array.isArray(result) ? result : []);

    return evaluations.map(ev => ({
        originalSentence: ev.sentence,
        userTranslation: ev.translation,
        targetWord: ev.target_word || ev.targetWord || ev.word,
        wordUsed: ev.word_used,
        feedback: ev.feedback,
        correctSentence: ev.correct_sentence,
        score: ev.score
    }));
}
