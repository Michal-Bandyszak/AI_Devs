import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config({ path: '../.env' });

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

const apiField = {
  token: '',
};


async function axiosRequest(url, method, data = null, headers = { 'Content-Type': 'application/json' }) {
  try {
     const response = await axios({ url, method, data, headers });
     return response.data; // Return the data part of the response
  } catch (error) {
     console.error("Error in axiosRequest:", error.message);
     throw error; // Rethrow the error to be handled by the caller
  }
 }
 
 


// Function to get authorization token
async function getAuthToken(taskName) {
  const url = `${API_URL}/token/${taskName}`;
  try {
     // Assuming API_KEY should be sent as JSON in the request body
     const response = await axiosRequest(url, 'POST', { apikey: API_KEY });
     apiField.token = response.token; // Assuming the response contains a 'token' property
     return response.token;
  } catch (error) {
     console.error("Error in getAuthToken:", error.message);
     throw error; // Rethrow the error to be handled by the caller
  }
 }
  

// Function to get task data
export async function getTask(taskName) {
  const token = await getAuthToken(taskName);
  const url = `${API_URL}/task/${token}`
  const task = await axiosRequest(url, 'GET');
  console.log(task.msg)
  return task.msg
}

export const postQuestionToTask = async (taskName, question) => {
  try {
    console.log('');
    console.info('[info] Sending question to task...');

    const form = new FormData();
    form.append('question', question);

    const response = await axios.post(`${API_URL}/task/${apiField.token}`, form); 
    console.log('');

    return response.data;
  } catch (e) {
    console.error('[error]', e); // Log the entire error object for inspection
    throw new Error('Error occurred while sending question: ' + e.message); 
  }
  
};

// Function to show hint

export async function showHint(taskName) {
  const url = `${API_URL}/hint/${taskName}`
  const hint = await axiosRequest(url, 'GET');
  console.log(hint)
}

// Function to send answer
export async function sendAnswer(answer) {
  await axios.post(`${API_URL}/answer/${apiField.token}`, answer);
}
