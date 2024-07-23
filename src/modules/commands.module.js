const { Composer } = require("grammy");

const homeBtn = require("../helpers/home.btn");
const User = require("../models/user.model");

const bot = new Composer();

bot.command("start", async (ctx) => {
  const user = await User.findOne({ telegramID: ctx.from.id });

  if (!user) {
    await User.create({
      telegramID: ctx.from.id,
      username: ctx.from.username,
      firstName: ctx.from.first_name,
    });
  } else {
    await User.findOneAndUpdate(
      { telegramID: ctx.from.id },
      {
        $set: {
          firstName: ctx.from.first_name,
          username: ctx.from.username,
        },
      }
    );
  }

  await ctx.reply("Assalomu alaykum, Xush kelibsiz", {
    reply_markup: {
      ...homeBtn,
      resize_keyboard: true,
    },
  });
});

module.exports = bot;
