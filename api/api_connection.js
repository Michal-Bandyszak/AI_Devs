import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config({ path: '../.env' });

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

const apiField = {
  token: '',
};

//Function to handle axios requests

async function axiosRequest(url, method, data = null, headers = { 'Content-Type': 'application/json' }) {
  try {
     const response = await axios({ url, method, data, headers });
     return response.data; 
  } catch (error) {
     console.error("Error in axiosRequest:", error.message);
     throw error; 
  }
 }
 
 
// Function to get authorization token
async function getAuthToken(taskName) {
  const url = `${API_URL}/token/${taskName}`;
  try {
     const response = await axiosRequest(url, 'POST', { apikey: API_KEY });
     apiField.token = response.token;
     return response.token;
  } catch (error) {
     console.error("Error in getAuthToken:", error.message);
     throw error; 
  }
 }
  

// Function to get task data
export async function getTask(taskName) {
  const token = await getAuthToken(taskName);
  const url = `${API_URL}/task/${token}`
  const task = await axiosRequest(url, 'GET');
  console.log(task)
  return task
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
    console.error('[error]', e);
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
  const url = `${API_URL}/answer/${apiField.token}`
  await axiosRequest(url, 'POST', answer );
  console.log("Answer sent successfully!")
}
