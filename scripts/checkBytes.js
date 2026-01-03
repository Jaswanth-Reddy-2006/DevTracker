const fs = require('fs');
const b = fs.readFileSync('src/App.jsx');
console.log('bytes:', Array.from(b.slice(0,4)));
console.log('hex :', b.slice(0,30).toString('hex'));
console.log('utf8:', b.slice(0,30).toString('utf8'));
