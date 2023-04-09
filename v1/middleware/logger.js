const log4js = require('log4js');

const config = require('../config/log4js');

try {
  require('fs').mkdirSync('./log');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error('Could not set up log directory, error was: ', e);
    process.exit(1);
  }
}
log4js.configure(config);

const log = log4js.getLogger('startup');

module.exports = log;
