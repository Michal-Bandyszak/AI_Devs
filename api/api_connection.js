import dotenv from 'dotenv';
import axios from 'axios';


dotenv.config({ path: '../.env' });

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

const apiField = {
  token: '',
};

// Centralized error handling function
function handleError(error, message) {
  if (error.response) {
    throw new Error(`${message}: ${error.response.data}`);
  } else {
    throw new Error(`${message}: ${error.message}`);
  }
}

// Function to get authorization token
async function getAuthToken(taskName) {
  try {
    const response = await axios.post(`${API_URL}/token/${taskName}`, { apikey: API_KEY }, { headers: { 'Content-Type': 'application/json' } });
    if (response.status === 200) {
      apiField.token = response.data.token
      return response.data.token;
    }
  } catch (error) {
    handleError(error, 'Error while authorizing');
  }
}

// Function to perform API requests
async function performRequest(url, method, data, errorMessage) {
  try {
    const response = await axios({ url, method, data, headers: { 'Content-Type': 'application/json' } });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    handleError(error, errorMessage);
  }
}

// Function to get task data
export async function getTask(taskName) {
  const token = await getAuthToken(taskName);
  return performRequest(`${API_URL}/task/${token}`, 'GET', null, 'Error while fetching task');
  // return axios.get(`${API_URL}/task/${token}`)
}

export const postQuestionToTask = async (taskName, question) => {
  try {
    console.log('');
    // console.info('[info] Sending question to task...');

    const form = new FormData();
    form.append('question', question);

    const response = await axios.post(`${API_URL}/task/${apiField.token}`, form); 
    console.log('Done. Response is:', response);
    console.log('');

    return response.data;
  } catch (e) {
    // console.error('[error]', e); // Log the entire error object for inspection
    throw new Error('Error occurred while sending question: ' + e.message); // Rethrow the error or handle it appropriately
  }
  
};


// Function to send answer
export async function sendAnswer(answer) {
  await axios.post(`${API_URL}/answer/${apiField.token}`, answer);
}
