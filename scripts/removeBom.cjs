const fs = require('fs');
const p = 'src/App.jsx';
let s = fs.readFileSync(p, 'utf8');
if (s.charCodeAt(0) === 0xFEFF) s = s.slice(1);
fs.writeFileSync(p, s, 'utf8');
console.log('Removed BOM if present');
