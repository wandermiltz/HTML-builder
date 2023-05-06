const path = require('path');
const fs = require('fs').promises;

const secretFolderName = 'secret-folder'
const secretFolderPath = path.join(__dirname, secretFolderName);

async function showFiles() {
  try {
    const objects = await fs.readdir(secretFolderPath); // получаем все объекты в директории
    objects.forEach(async obj => {
      const objPath = path.join(secretFolderPath, obj);
      const stats = await fs.stat(objPath); // вызываем stat чтобы получить информацию об объекте
      if (stats.isFile()) { // проверяем является ли объект файлом
        const fileName = path.parse(obj).name;
        const fileExtension = path.extname(obj).slice(1);
        const fileSize = stats.size / 1024;
        console.log(`${fileName} - ${fileExtension} - ${fileSize} kb`);
      }
    })
  } catch (err) {
    console.error(err);
  }
}

showFiles();