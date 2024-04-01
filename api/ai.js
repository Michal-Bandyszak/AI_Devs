import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: "../.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const aiEmbedding = async function(phrase) {
    console.log('')
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: phrase
    })
    return response
}

export const chatWithAi = async function(systemPrompt, prompt, model) {
    console.log('');
    console.log('[OpenAI] systemPrompt', systemPrompt);
    console.log('[OpenAI] prompt', prompt);
    console.log('[OpenAI] model', model);
  
    const completion = await openai.chat.completions.create({
      messages: [{
        role: 'system',
        content: systemPrompt,
      }, {
        role: 'user',
        content: prompt,
      }],
      model,
    });
  
    return(completion);

  }
