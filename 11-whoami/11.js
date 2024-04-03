import { getTask, sendAnswer } from "../api/api_connection.js";
import { chatWithAi } from "../api/ai.js";

const taskName = "whoami"

async function main() {
    let person = ''
    let isNotGuessed = true
    const hintList = []
    
    while(isNotGuessed) {
        const item = await getTask(taskName)
        hintList.push(item.hint)
        const context = `${hintList.join('. ')}.`;
        const systemMessage = `
        Use the context to guess the famous person. Represent the response as a JSON object using this format:

        JSON:
        {
            "guessed": "YES|NO",
            "famousPerson": "guessed person|''"
        }

        Rules:
        - "guessed" - if you guessed the famous person return YES, otherwise return NO. Return YES only if you are fully sure about the person. If you are unsure return NO.
        - "famousPerson": if you guessed return the name and surname of the famous person. Otherwise return an empty string ''.
        - Respond in the JSON format and nothing else. Do not wrap JSON with back-ticks or quotes.

        Examples:
        - context: "In 1990, his popularity increased dramatically when he starred in the popular television series The Fresh Prince of Bel-Air. He has received Best Actor Oscar nominations for Ali and The Pursuit of Happyness."
        - response:
        {
            "guessed": "YES",
            "famousPerson": "Will Smith"
        }
        `

        const answer = await chatWithAi(systemMessage, context, "gpt-3.5-turbo")
        console.log(answer.choices[0].message)
        const answerData = JSON.parse(answer.choices[0].message.content)
        const guessed = answerData.guessed;
        const famousPerson = answerData.famousPerson;

        if (guessed === 'YES'){
            isNotGuessed = false
            person = famousPerson
        }
        
        await delay(3000)
    }
    
    await sendAnswer({"answer": person})
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main()
