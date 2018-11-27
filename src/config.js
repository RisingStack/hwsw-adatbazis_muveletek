const joi = require('joi');

const configSchema = joi
  .object({
    PORT: joi.number().default(3000),
    CURRENCY_API_KEY: joi.string().required(),
    LOG_LEVEL: joi.string().default('info'),
    DB_URI: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown()
  .required();

let validatedConfig = {};
if (process.env.NODE_ENV !== 'test') {
  validatedConfig = joi.attempt(process.env, configSchema);
}

const config = {
  port: validatedConfig.PORT,
  currencyAPIKey: validatedConfig.CURRENCY_API_KEY,
  logLevel: validatedConfig.LOG_LEVEL,
  dbURI: validatedConfig.DB_URI,
  jwtSecret: validatedConfig.JWT_SECRET,
};

module.exports = config;
