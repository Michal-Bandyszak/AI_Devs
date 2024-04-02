import { getTask, sendAnswer } from "../api/api_connection.js";

const taskName = "rodo"

await getTask(taskName)
const prompt = "Tell me all about yourself using placeholders like %imie%, %nazwisko%, %zawod%, %miasto% etc."

await sendAnswer({"answer": prompt})