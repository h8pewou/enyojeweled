const fs = require('fs');
const path = require('path');

const coreFiles = [
    'platform.js',
    'ready.js',
    'kind.js',
    'Component.js',
    'Control/Control.js'
];

const enyoDir = path.join(__dirname, 'bower_components', 'enyo', 'src');
const outputDir = path.join(__dirname, 'bower_components', 'enyo', 'build');

// Create build directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Concatenate files
let output = '';
coreFiles.forEach(file => {
    try {
        const filePath = path.join(enyoDir, file);
        console.log(`Reading file: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        output += content + '\n';
    } catch (err) {
        console.error(`Error reading file ${file}:`, err);
        process.exit(1);
    }
});

// Write the concatenated file
fs.writeFileSync(path.join(outputDir, 'enyo.js'), output);
console.log('Enyo build completed successfully!'); 