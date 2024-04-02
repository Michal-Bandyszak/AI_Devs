import { getTask, sendAnswer } from "../api/api_connection.js";

const taskName = "functions"

const main = async function(){
    try {     
        await getTask(taskName);
        const addUser = function() {
            return {
                name: "addUser",
                description: "User to add",
                parameters: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "User first name"
                        },
                        surname: {
                            type: "string",
                            description: "User surname"
                        },
                        year: {
                            type: "integer",
                            description: 'Year of birth'
                        },
                    },
                    required: [
                        "name", "surname", "year"
                    ]
                    }
                }
            }
        
        
        await sendAnswer({"answer": addUser()})
    }
    catch (error) {
        console.log("An error accured", error)
    }
}();