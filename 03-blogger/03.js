import OpenAI from "openai";
import dotenv from "dotenv";
import { getTask, sendAnswer } from "../api/api_connection.js";

dotenv.config({path: "../.env"});

const taskName = "blogger";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemTemplate = `
    Jako specjalista od pizzy i blogger piszesz wpis o pizzy. Podany temat jest fragmentem tego wpisu, 
    zatem to, co napiszesz, jest fragmentem większej całości, która składa się z tematów:

    {topics}
`;

const humanTemplate = `Napisz kilka zdań na temat {topic}`;

async function generateChatPrompt(topics) {
    const chatPrompt = [
        { role: 'system', content: systemTemplate },
        { role: 'user', content: humanTemplate },
    ];

    return topics.map(topic => (
        [
            ...chatPrompt,
            { role: 'system', content: topic }
        ]
    ));
}

async function getOpenAICompletions(chatPrompts) {
    const promises = [];
    for (const formattedPrompt of chatPrompts) {
        const completionPromise = openai.chat.completions.create({
            messages: formattedPrompt,
            model: 'gpt-3.5-turbo', // Adjust model according to your requirement
        });
        promises.push(completionPromise);
    }
    return Promise.all(promises);
}

async function main() {
    try {
        const { blog } = await getTask(taskName);
        const topics = blog.join("; ");
        const chatPrompts = await generateChatPrompt(blog);
        const completions = await getOpenAICompletions(chatPrompts);

        const results = completions.map(completion => (
            completion.choices[0]?.message?.content
        ));

        console.log("Results:", results);

        const isOK = await sendAnswer(taskName, results);
        console.log("Answer sent successfully.");
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
