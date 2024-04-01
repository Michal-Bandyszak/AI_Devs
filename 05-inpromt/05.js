import { getTask, sendAnswer } from "../api/api_connection.js";
import { chatWithAi } from "../api/ai.js";

const taskName = "inprompt"

const main = async function(){
    const task = await getTask(taskName);
    const input = task.input;

    const question = task.question;
    const findName = await chatWithAi("Zwróć tylko Imię z podanego pytania", question, 'gpt-3.5-turbo')

    const filtered_input = input.filter(str => str.includes(findName))
    console.log(filtered_input)
    const answerFromChat = await chatWithAi(filtered_input, question, "gpt-3.5-turbo" )
    const ans = answerFromChat.choices[0].message.content
    console.log(ans)
    // await sendAnswer({answer: answerFromChat.message.content})
    sendAnswer({answer: ans})

}

main();
