const fs = require('fs');
const config = fs.readFileSync('./config.json').toString();

module.exports = JSON.parse(config);