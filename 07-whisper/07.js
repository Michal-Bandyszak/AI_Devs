import { getTask, sendAnswer } from "../api/api_connection.js";
import { chatWithAi } from "../api/ai.js";

const taskName = "whisper"

const main = async function(){
    const task = await getTask(taskName);
    console.log(task)
}();

