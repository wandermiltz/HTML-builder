const fs = require('fs');
const path = require('path');

const textPath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(textPath, 'utf-8');

let result = '';

readStream.on('data', (chunk) => {
  result += chunk;
});

readStream.on('end', () => {
  process.stdout.write(result);
});

readStream.on('error', () => {
  process.stdout.write('Ошибка\n');
});