const { init, shutdown } = require('./web/server');
const logger = require('./logger');
const { connect, disconnect } = require('./db');

async function startup() {
  try {
    await init();
    logger.info('Server is ready to accept connections');
    await connect();

    process.once('SIGINT', () => {
      shutdown(async () => {
        try {
          await disconnect();
          console.log('Lekapcsoldotunk az adatbazisrol');
          process.exit(0);
        } catch (ex) {
          console.log('Nem sikerult lekapcsolodni az adatbazisrol');
          process.exit(1)
        }
      });
    });

    logger.info('Database is ready');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

startup();
