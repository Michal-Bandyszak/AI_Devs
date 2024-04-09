import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

async function invoke(systemMessage, humanMessage, options, model = 'gpt-3.5-turbo') {
  const openAi = new ChatOpenAI({ modelName: model });
  const response = await openAi.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(humanMessage),
  ], options);
  return response.content;
}


async function getEmbedding(text, model = 'text-embedding-ada-002') {
  const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5, modelName: model });
  return embeddings.embedQuery(text);
}

export { invoke, getEmbedding };
