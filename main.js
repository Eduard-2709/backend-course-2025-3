const { program } = require('commander');
const fs = require('fs');

program
    .option('-i, --input <path>', 'Path to input JSON file')
    .option('-o, --output <path>', 'Path to output file')
    .option('-d, --display', 'Display results in console')
    .option('-v, --variety', 'Display flower variety')
    .option('-l, --length <number>', 'Display only records with petal length greater than specified', parseFloat);

program.parse(process.argv);

const options = program.opts();

// �������� ����'�������� ���������
if (!options.input) {
    console.error('Please, specify input file');
    process.exit(1);
}

// �������� ��������� �����
if (!fs.existsSync(options.input)) {
    console.error('Cannot find input file');
    process.exit(1);
}

// ������� �����
let fileContent;
try {
    fileContent = fs.readFileSync(options.input, 'utf8');
} catch (error) {
    console.error('Error reading file:', error.message);
    process.exit(1);
}

// ������� JSON (����� ����� - ������� JSON ��'���)
const lines = fileContent.trim().split('\n');
const data = lines.map(line => JSON.parse(line));

// Գ�������� ����� �� �������� ��������
let filteredData = data;
if (options.length !== undefined) {
    filteredData = data.filter(item => item['petal.length'] > options.length);
}

// ���������� ����������
const results = filteredData.map(item => {
    let output = `${item['petal.length']} ${item['petal.width']}`;

    if (options.variety) {
        output += ` ${item.variety}`;
    }

    return output;
});

// ���������� ������
const outputText = results.join('\n');

// ���� ����������
if (!options.output && !options.display) {
    // ���� �� ������ ������� � ������'������� ��������� - ����� �� ��������
    process.exit(0);
}

if (options.display) {
    console.log(outputText);
}

if (options.output) {
    try {
        fs.writeFileSync(options.output, outputText, 'utf8');
    } catch (error) {
        console.error('Error writing file:', error.message);
        process.exit(1);
    }
}