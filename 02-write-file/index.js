const fs = require('fs');
const readline = require('readline');

const textFile = 'text.txt';
const messageOnStart = 'Введите текст:';
const messageOnContinue = 'Текст записан в файл, можете продолжить ввод:'
const messageOnEnd = 'До свидания!';

// Создаем поток записи в файл
const writeStream = fs.createWriteStream(textFile, { flags: 'a' }); //'a' - флаг append для добавления к уже существующему контенту файла

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
    console.log(messageOnEnd);
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