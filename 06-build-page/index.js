
const path = require('path');
const fs = require('fs').promises;

const templateFilePath = path.join(__dirname, 'template.html')
const componentsDirPath = path.join(__dirname, 'components')

const stylesDirPath = path.join(__dirname, 'styles');
const assetsDirPath = path.join(__dirname, 'assets');
const projectDistDirPath = path.join(__dirname, 'project-dist');

const projectDistAssetsDirPath = path.join(projectDistDirPath, 'assets');
const projectDistStylesFilePath = path.join(projectDistDirPath, 'style.css')
const projectDistIndexFilePath = path.join(projectDistDirPath, 'index.html');

async function replaceTemplates() {
  try {
    const template = await fs.readFile(templateFilePath, 'utf8'); // читаем файл шаблона
    const tagRegexp = /{{([a-z]+)}}/g; // находим все шаблонные теги регуляркой
    const tagsArr = template.match(tagRegexp); // добавляем их в массив

    let result = template;

    for (const tag of tagsArr) {
      const componentName = tag.slice(2, -2);
      const componentFilePath = path.join(componentsDirPath, `${componentName}.html`);
      try {
        const component = await fs.readFile(componentFilePath, 'utf8'); // читаем файл компонента
        result = result.replace(tag, component); // заменяем содержимое тэга компонентом
      } catch (err) {
        console.log(err);
      }
    }
    await fs.writeFile(projectDistIndexFilePath, result); // записываем результат
  } catch (err) {
    console.error(err);
  }
}

// Сборка в единый файл стилей из папки styles и их запись в файл project-dist/style.css (функция из задачи 5):
async function mergeStyles() {
  try {
    const objects = await fs.readdir(stylesDirPath); /// получаем все объекты в директории
    const cssFilesArr = []

    for (const obj of objects) {
      const objPath = path.join(stylesDirPath, obj)
      const stat = await fs.stat(objPath); // вызываем stat, чтобы получить информацию об объекте
      if (stat.isFile()) { // проверяем, является ли объект файлом
        const fileExtension = path.extname(obj); // получаем расширение файла
        if (fileExtension === '.css') {
          cssFilesArr.push(obj) // добавляем в массив только css файлы
        }
      }
    }
    const styles = await Promise.all(// ждем завершения всех промисов чтения файлов
      cssFilesArr.map(file => fs.readFile(path.join(stylesDirPath, file), 'utf-8'))
    );

    await fs.writeFile(projectDistStylesFilePath, styles.join('\n'), 'utf-8'); // записываем стили в style.css
  } catch (err) {
    console.error(err);
  }
}

// Копирование папки assets в project-dist/assets (функия из задачи 4):
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

    for (const obj of objects) {
      const sourcePath = path.join(source, obj);
      const destPath = path.join(dest, obj);
      const stat = await fs.stat(sourcePath);

      if (stat.isDirectory()) {
        await copyDirRecursive(sourcePath, destPath); // если объект - это директория с файлами, то копируем содержимое рекурсивно
      } else {
        await fs.copyFile(sourcePath, destPath); // просто копируем, если объект - это файл
      }
    }
  }
  try {
    copyDirRecursive(assetsDirPath, projectDistAssetsDirPath);
  } catch (err) {
    console.error(err);
  }
}

replaceTemplates();
mergeStyles();
copyDir();