import fs from 'fs'
export function unminify(filePath) {
    // Split the JSON string into a list of tokens.
    const jsonString = fs.readFileSync(filePath, 'utf8');
    const tokens = jsonString.split('');

    // Create a new JSON string with newlines and indentation.
    let newJsonString = '';
    let indentLevel = 0;
    for (const token of tokens) {
    if (token === '{') {
        newJsonString += '\n';
        indentLevel += 1;
        newJsonString += ' '.repeat(indentLevel);
        newJsonString += token;
    } else if (token === '}') {
        indentLevel -= 1;
        newJsonString += '\n';
        newJsonString += ' '.repeat(indentLevel);
        newJsonString += token;
    } else if (token === ',') {
        newJsonString += ', ';
    } else {
        newJsonString += token;
    }
    }

    // save to new file
    fs.writeFileSync(filePath.replace(/Min/g, ''), newJsonString, 'utf8');

}