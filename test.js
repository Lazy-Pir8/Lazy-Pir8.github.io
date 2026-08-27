const fs = require('fs');
const content = fs.readFileSync('script.js', 'utf8');
console.log("File exists and length:", content.length);
