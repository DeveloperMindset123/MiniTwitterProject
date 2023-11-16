import {OpenAI} from 'openai';
import dotenv from 'dotenv/config'; // even tho its gray its needed
import { resolve } from 'path';
import { rejects } from 'assert';
const apiKey = process.env.OPENAI_API_KEY;


function generateChatResponse(apiKey, prompt) {
  return new Promise((resolve, reject) => {
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: "You will recieve error outputs, your goal is to help me fix this error and understand how it happened. Your name is Hal - like the AI from 2001 space odyssey. You will respond quick and concise and in plain text - no formatting."},
        { role: 'user', content: prompt }
      ],
    })
    .then(response => resolve(response))
    .catch(error => reject(error));
  });
}
export async function handleDebug(input) {
  try {
    const response = await generateChatResponse(apiKey, String(input));
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}