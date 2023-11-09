function filterText(text, filterWords) {
    let counter = 0;
    const filteredText = text.replace(/\b\w+\b/g, (match) => {
        if (filterWords.includes(match.toLowerCase())) {
            counter++;
            return '*'.repeat(match.length);
        }
        return match;
    });

    return { counter, filteredText };
}
import fs from 'fs';
function getBannedWords(){
    const filePath = 'bannedWords.json';
    try {
        const jsonContent = fs.readFileSync(filePath, 'utf8');
        const config = JSON.parse(jsonContent);

        return config.banned;
    } catch (err) {
        console.error('Error reading or parsing the JSON file:', err);
    }
}

const text = "penis, fuck omg lets go";
console.log(filterText(text, getBannedWords()));