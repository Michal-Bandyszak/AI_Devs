import { getTask, sendAnswer, showHint } from "../api/api_connection.js";
import * as langchainService from '../services/langchain.js';
import * as qdrantService from '../services/qdrant.js';
import { v4 } from 'uuid';
import * as R from 'ramda';


const taskName = "people";

const BATCH_SIZE = 100;
const BATCH_DELAY = 1_000;
const COLLECTION_NAME = 'people';
const PEOPLE_DATA_URL = 'https://tasks.aidevs.pl/data/people.json';

const task = await getTask(taskName)

const question = task.question

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


async function handler(question) {
    const client = qdrantService.createClient();

    if (!(await qdrantService.isCollectionExists(client, COLLECTION_NAME))) {
        await qdrantService.createCollection(client, COLLECTION_NAME, true);
    }

    if (await qdrantService.isEmptyCollection(client, COLLECTION_NAME)) {
        const peopleList = await getPeople();
        const batches = R.splitEvery(BATCH_SIZE, peopleList);
        for (const people of batches) {
        const items = await prepareQdrantItems(people);
        await qdrantService.upsertItems(client, COLLECTION_NAME, items);
        await delay(BATCH_DELAY);
        }
    }

  const queryEmbedding = await langchainService.getEmbedding(question);
  const response = await qdrantService.searchItem(client, COLLECTION_NAME, queryEmbedding);
  console.log(response)
  const systemMessage = `
    You have to answer the given question based on the context provided.
    The answer should be short, without additional information.
    ### Context:\n${response.payload.content}
  `;
  return langchainService.invoke(systemMessage, question);
}

async function prepareQdrantItems(peopleList) {
  const items = [];
  for (const people of peopleList) {
    const content = generateContent(people);
    const vector = await langchainService.getEmbedding(content);
    const item = {
      vector,
      payload: { content },
      id: v4(),
    };
    items.push(item);
  }
  return items;
}

function generateContent(people) {
  return [
    `Imie: ${people.imie}`,
    `Nazwisko: ${people.nazwisko}`,
    `Wiek: ${people.wiek}`,
    `O mnie: ${people.o_mnie}`,
    `Ulubiona postac z kapitana bomby: ${people.ulubiona_postac_z_kapitana_bomby}`,
    `Ulubiony serial: ${people.ulubiony_serial}`,
    `Ulubiony film: ${people.ulubiony_film}`,
    `Ulubiony kolor: ${people.ulubiony_kolor}`,
  ].join(', ');
}

async function getPeople() {
  const response = await fetch(PEOPLE_DATA_URL);
  return response.json();
}


async function main() {
    const response = await handler(question)
    console.log(response)
    
    await sendAnswer({answer: response})
}

main()

