require("dotenv/config");
const { env } = process;

const config = {
  token: env.TOKEN,
  mongoUri: env.MONGO_URI,
};

module.exports = config;
