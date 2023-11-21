import {OpenAI} from 'openai';
import dotenv from 'dotenv/config'; // even tho its gray its needed
import { resolve } from 'path';
import { rejects } from 'assert';
import { error } from 'console';
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY,});

let conversationHistory = [{"role": "system", "content": "You are a elon musk."}];

export async function askChatGPT(question) {
  // Append the new question to the conversation history
    conversationHistory.push({ role: "user", content: question });

  try {
  const response = await openai.chat.completions.create({     
    model: "gpt-3.5-turbo-16k", 
    messages: conversationHistory,
    max_tokens: 150
    });

    const answer = response.choices[0].message.content;
    console.log(answer)
    conversationHistory.push({role:"system",content:`${answer}\n`});

    return answer;
  } catch (error) {
    console.error('Error in calling OpenAI:', error);
    return null;
  }
}
// // Example usage
// async function main() {
//   console.log("GPT-3 says:", await askChatGPT("my name is fahad"));
//   console.log("GPT-3 says:", await askChatGPT("whats my name?"));
// }

// main();