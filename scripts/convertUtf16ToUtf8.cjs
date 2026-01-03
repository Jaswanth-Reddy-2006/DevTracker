const fs = require('fs');
const path = 'src/App.jsx';
const content = fs.readFileSync(path, 'utf16le');
fs.writeFileSync(path, content, 'utf8');
console.log('Converted', path, 'to utf8');
