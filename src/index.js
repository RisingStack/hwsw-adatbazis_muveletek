const { init } = require('./server');
const logger = require('./logger');

async function startup() {
  try {
    await init();
    logger.info('Server is ready to accept connections');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

startup();
