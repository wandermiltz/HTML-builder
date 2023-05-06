
const path = require('path');
const fs = require('fs').promises;

const filesFolderPath = path.join(__dirname, 'files');
const filesCopyFolderPath = path.join(__dirname, 'files-copy');

async function copyDir() {

  async function copyDirRecursive(source, dest) {
    let destStat;
    try {
      destStat = await fs.stat(dest); // вызываем stat, чтобы получить информацию об объекте
    } catch (err) { // если  ошибка, то объекта не существует, destStat null
      destStat = null;
    }

    if (destStat && destStat.isDirectory()) { // проверяем, является ли объект директорией
      await fs.rm(dest, { recursive: true }); // удаляем директорию-копию, если она уже существует
    }

    await fs.mkdir(dest, { recursive: true }); // создаем директорию-копию
    const objects = await fs.readdir(source); // получаем все объекты в директории

    objects.forEach(async obj => {
      const sourcePath = path.join(source, obj);
      const destPath = path.join(dest, obj);
      const stat = await fs.stat(sourcePath);

      if (stat.isDirectory()) {
        await copyDirRecursive(sourcePath, destPath); // если объект - это директория с файлами, то копируем содержимое рекурсивно
      } else {
        await fs.copyFile(sourcePath, destPath); // просто копируем, если объект - это файл
      }
    })
  }
  try {
    copyDirRecursive(filesFolderPath, filesCopyFolderPath);
  } catch (err) {
    console.error(err);
  }
}

copyDir();