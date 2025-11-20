import {EVALUATE_TRANSLATIONS_PROMPT, GET_SENTENCES_PROMPT} from "./prompts.js";
import {DAILY_DRAGON_API_BASE_URL} from "../../config.js";

const AI_SERVICE_URL = DAILY_DRAGON_API_BASE_URL + "/openai";


export async function getPracticeSentences(words) {
    const prompt = GET_SENTENCES_PROMPT
        .replace("${words}", JSON.stringify(words))
        .replace("${targetLanguage}", "English")
        .replace("${targetLanguage}", "English");

    const response = await fetch(AI_SERVICE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({prompt})
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
}

export async function submitTranslations({words, sentences, translations}) {
    const prompt = EVALUATE_TRANSLATIONS_PROMPT +
        sentences.map((sentence, index) => {
            return `${index+1}. Sentence: "${sentence}"\n` +
                `User Translation: "${translations[index]}"\n` +
                `Target Word: "${words[index]}"\n`;
        }).join("\n");

    const response = await fetch(AI_SERVICE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({prompt})
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
}
