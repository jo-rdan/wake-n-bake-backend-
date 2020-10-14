require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL_DEV',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgresql',
    logging: false,
  },
};
