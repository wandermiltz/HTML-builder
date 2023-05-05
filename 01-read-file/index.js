const fs = require('fs');
const path = require('path');

const textPath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(textPath);

readStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});

readStream.on('error', () => {
  process.stdout.write('Ошибка\n');
});