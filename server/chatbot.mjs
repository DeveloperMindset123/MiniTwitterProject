import fs from 'fs';
import OpenAI from 'openai';

function apiKey(){
    const filePath = 'apiKey.json';
    try {
        const jsonContent = fs.readFileSync(filePath, 'utf8');
        const config = JSON.parse(jsonContent);

        return config;
    } catch (err) {
        console.error('Error reading or parsing the JSON file:', err);
    }
}
const openai = new OpenAI({
    apiKey: String(apiKey().apiKey) 
});
const userPrompt = "hello my name is fahad";
async function gpt(userPrompt){
    try {
        const gptResponse = await openai.completion.create('text-davinci-003', {
            prompt: userPrompt,
            max_tokens: 150
            });

        return gptResponse.data.choices[0].text.trim();

        } catch (error) {
            console.error('Error calling OpenAI API:', error);
    }
}
console.log(gpt(userPrompt));