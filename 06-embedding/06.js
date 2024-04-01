import { getTask, sendAnswer } from "../api/api_connection.js";
import { aiEmbedding } from "../api/ai.js";

const taskName = "embedding"
await getTask(taskName);
const text = "Hawaiian pizza";

aiEmbedding(text).then(embedding => {
    const answer = embedding.data[0].embedding
    sendAnswer({"answer": answer})
}).catch(error => {
    console.error("Error: ", error)
})


