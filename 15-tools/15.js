import { getTask, sendAnswer } from "../api/api_connection.js";
import { invoke } from "../services/langchain.js";

const main = async function () {
  const task = await getTask("tools");
  const question = task.question;
  const systemMessage = `Categorize task into ToDo (task) or Calendar (if there is a date given) categories.
    For Calendar category you return only JSON like this {"tool":"Calendar", "desc":"Description of the task", "date":"YYYY-MM-DD"}
    For ToDo category you return only json like {"tool":"ToDo", "desc":"Description of the task"}
    Convert user prompt into task description ex. "rememebr me, that I should buy some milk" => "Buy some milk"
    For the date consider today as 2024-04-10`;
  const answer = await invoke(systemMessage, question, "gpt-4-turbo");
  const parsedAns = JSON.parse(answer);
  await sendAnswer({
    answer: {
      tool: parsedAns.tool,
      desc: parsedAns.desc,
      date: parsedAns.date,
    },
  });
};

main();
