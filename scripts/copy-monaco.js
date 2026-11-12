const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '../node_modules/monaco-editor/min/vs');
const destination = path.resolve(__dirname, '../public/monaco/vs');

if (!fs.existsSync(source)) {
  throw new Error('Monaco assets are missing. Install dependencies before starting the app.');
}

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.cpSync(source, destination, { recursive: true });
console.log(`Copied Monaco assets to ${destination}`);
