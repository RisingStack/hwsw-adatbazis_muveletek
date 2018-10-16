const axios = require('axios');
const { currencyAPIKey } = require('./config');
const logger = require('./logger');

async function getCurrency() {
  return axios.get(`https://my.api.mockaroo.com/currency?key=${currencyAPIKey}`)
    .then(response => response.data)
    .catch((err) => {
      logger.error(err);
      return { value: -1 };
    });
}

module.exports = getCurrency;
