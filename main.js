const { program } = require('commander');
const fs = require('fs');

program
  .requiredOption('-i, --input <path>', 'Шлях до вхідного JSON-файлу')
  .option('-o, --output <path>', 'Шлях до вихідного файлу')
  .option('-d, --display', 'Показати результати в консолі')
  .option('-v, --variety', 'Показати різноманітність квітів')
  .option('-l, --length <number>', 'Відображати лише записи з довжиною пелюсток, більшою за вказану', parseFloat);

program.parse(process.argv);

const options = program.opts();

// Перевірка обов'язкового параметра
if (!options.input) {
  console.error('Будь ласка, вкажіть вхідний файл');
  process.exit(1);
}

// Перевірка існування файлу
if (!fs.existsSync(options.input)) {
  console.error('Не вдається знайти вхідний файл');
  process.exit(1);
}

// Читання файлу
let fileContent;
try {
  fileContent = fs.readFileSync(options.input, 'utf8');
} catch (error) {
  console.error('Помилка читання файлу:', error.message);
  process.exit(1);
}

// Парсинг JSON (кожен рядок - окремий JSON об'єкт)
const lines = fileContent.trim().split('\n');
const data = lines.map(line => JSON.parse(line));

// Фільтрація даних за довжиною пелюстки
let filteredData = data;
if (options.length !== undefined) {
  filteredData = data.filter(item => item['petal.length'] > options.length);
}

// Формування результату
const results = filteredData.map(item => {
  let output = `${item['petal.length']} ${item['petal.width']}`;
  
  if (options.variety) {
    output += ` ${item.variety}`;
  }
  
  return output;
});

// Формування виводу
const outputText = results.join('\n');

// Вивід результатів
if (!options.output && !options.display) {
  // Якщо не задано жодного з необов'язкових параметрів - нічого не виводимо
  process.exit(0);
}

if (options.display) {
  console.log(outputText);
}

if (options.output) {
  try {
    fs.writeFileSync(options.output, outputText, 'utf8');
  } catch (error) {
    console.error('Помилка запису файлу:', error.message);
    process.exit(1);
  }
}