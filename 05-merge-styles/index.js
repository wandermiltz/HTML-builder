const path = require('path');
const fs = require('fs').promises;

const stylesDirPath = path.join(__dirname, 'styles');
const projectDistDirPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(projectDistDirPath, 'bundle.css');

async function mergeStyles() {
  try {
    const objects = await fs.readdir(stylesDirPath); /// получаем все объекты в директории
    const cssFilesArr = [];

    for (const obj of objects) {
      const objPath = path.join(stylesDirPath, obj);
      const stat = await fs.stat(objPath); // вызываем stat, чтобы получить информацию об объекте
      if (stat.isFile()) { // проверяем, является ли объект файлом
        const fileExtension = path.extname(obj); // получаем расширение файла
        if (fileExtension === '.css') {
          cssFilesArr.push(obj); // добавляем в массив только css файлы
        }
      }
    }
    const styles = await Promise.all(// ждем завершения всех промисов чтения файлов
      cssFilesArr.map(file => fs.readFile(path.join(stylesDirPath, file), 'utf-8'))
    );

    await fs.writeFile(bundleFilePath, styles.join('\n'), 'utf-8'); // записываем стили в bundle.css
  } catch (err) {
    console.error(err);
  }
}

mergeStyles();