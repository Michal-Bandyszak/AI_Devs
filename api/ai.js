import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from "fs"

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

export const chatWithAi = async function(systemPrompt, prompt, model, temperature = 0) {
    console.log('');
    console.log('[OpenAI] systemPrompt', systemPrompt);
    console.log('[OpenAI] prompt', prompt);
    console.log('[OpenAI] model', model);
    console.log('[OpenAI] temperature', temperature);
  
    const completion = await openai.chat.completions.create({
      messages: [{
        role: 'system',
        content: systemPrompt,
      }, {
        role: 'user',
        content: prompt,
      }],
      model,
      temperature
    });
  
    return(completion);

  }
  
export const transcribe = async function() {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream("C:\\Repos\\AIDEVS-reloaded\\mateusz.mp3"),
      model: "whisper-1",
      
    });
  
    return transcription.text;
  }
