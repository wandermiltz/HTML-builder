const fs = require('fs');
const readline = require('readline');
const path = require('path');

const textFile = 'text.txt';
const textFilePath = path.join(__dirname, textFile);
const messageOnStart = 'Введите текст:';
const messageOnContinue = 'Текст записан в файл, можете продолжить ввод:'
const messageOnEnd = 'До свидания!';

// Создаем поток записи в файл
const writeStream = fs.createWriteStream(textFilePath, { flags: 'a' }); //'a' - флаг append для добавления к уже существующему контенту файла

// Выводим приветствие
console.log(messageOnStart);

// Создаем интерфейс для построчного чтения из потока ввода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Обработка введенного текста
rl.on('line', (input) => {
  if (input === 'exit') {
    console.log(`\n${messageOnEnd}`);
    writeStream.end();
    process.exit();
  } else {
    writeStream.write(input);
    console.log(messageOnContinue);
  }
});

// Обработка завершения процесса по ctrl + c
rl.on('SIGINT', () => {
  console.log(messageOnEnd);
  writeStream.end();
  process.exit();
});