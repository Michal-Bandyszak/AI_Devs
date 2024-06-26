import { getTask, sendAnswer } from "../api/api_connection.js";
import { chatWithAi } from "../api/ai.js";

const taskName = "scraper"

const { question, input: url } = await getTask(taskName);
const { choices: [{ message: { content: answer } }] } = await chatWithAi(`Base only on the knowledge from article ${url}. Answers longer than 200 chars are forbidden.`, question, "gpt-3.5-turbo");
await sendAnswer({ answer });
