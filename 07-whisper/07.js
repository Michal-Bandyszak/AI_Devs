import { getTask, sendAnswer } from "../api/api_connection.js";
import { transcribe } from "../api/ai.js";

const taskName = "whisper"

const main = async function(){
    try {
        const task = await getTask(taskName);
        const answer = await transcribe()
        await sendAnswer({"answer": answer})
    }
    catch (error) {
        console.log("An error accured", error)
    }
}();

