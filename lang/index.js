const fs = require('fs');
const lang = JSON.parse(fs.readFileSync('./en.json').toString());

module.exports = lang;