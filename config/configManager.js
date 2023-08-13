import fs from 'fs'

const configFilePath = 'config.json';

function readConfig() {
  const configData = fs.readFileSync(configFilePath, 'utf8');
  return JSON.parse(configData);
}

function updateConfig(newConfig) {
  fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2));
}

module.exports = { readConfig, updateConfig };