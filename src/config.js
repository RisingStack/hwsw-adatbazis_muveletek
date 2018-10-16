const joi = require('joi');

const configSchema = joi.object({
  PORT: joi.number().default(3000),
  CURRENCY_API_KEY: joi.string().required(),
  LOG_LEVEL: joi.string().default('info'),
}).unknown().required();

const validatedConfig = joi.attempt(process.env, configSchema);

const config = {
  port: validatedConfig.PORT,
  currencyAPIKey: validatedConfig.CURRENCY_API_KEY,
  logLevel: validatedConfig.LOG_LEVEL,
};

module.exports = config;
