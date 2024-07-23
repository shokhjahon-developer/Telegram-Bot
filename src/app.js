const { Bot, session } = require("grammy");
const { connect } = require("mongoose");
const { hydrateFiles } = require("@grammyjs/files");

const config = require("../config");
const commendModule = require("./modules/commands.module");
const starterModule = require("./modules/start.module");

const bot = new Bot(config.token);
bot.api.config.use(hydrateFiles(bot.token));

bot.use(session({ initial: () => ({ step: "start" }) }));

bot.use(commendModule);
bot.use(starterModule);

const bootstrap = async () => {
  try {
    connect(config.mongoUri);

    bot.start({
      onStart: () => {
        console.log("Bot started!");
      },
    });
  } catch (error) {
    process.exit(1);
  }
};

bot.catch((error) => {
  console.log(error);
});

bootstrap();
