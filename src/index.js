const { init } = require('./web/server');
const logger = require('./logger');
const { connect } = require('./db');

async function startup() {
  try {
    await init();
    logger.info('Server is ready to accept connections');
    await connect();
    logger.info('Database is ready');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

startup();
