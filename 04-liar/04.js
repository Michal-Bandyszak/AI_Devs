import OpenAI from "openai";
import dotenv from "dotenv";

import { getTask, sendAnswer, postQuestionToTask } from "../api/api_connection.js";
import { chatWithAi} from '../api/ai.js'


dotenv.config({ path: "../.env" });

const API_KEY = process.env.API_KEY;
const url = process.env.API_URL;

const taskName = "liar";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function main() {
    const liar = async function() {
        const question = 'What is the capital of Poland?';
        await getTask('liar');
        const q = await postQuestionToTask(taskName, question);
      
        const systemPrompt = 'You check if the answer is correct for a given answer. In the response you return just a string YES or NO.';
        const prompt = 'question```'+question+'``` answer```'+ q.answer +'```';
      
        const asnwerFromChat = await chatWithAi(systemPrompt, prompt, 'gpt-3.5-turbo');
      
        sendAnswer({ answer: asnwerFromChat.message.content });
      }
      
      liar();
    }

main();
