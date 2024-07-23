const { unlink, readFileSync } = require("fs");
const { InputFile } = require("grammy");
const createQr = require("qrcode");
const { v4: uuid } = require("uuid");
const readQr = require("qrcode-reader");
const Jimp = require("jimp");



const qr = async (bot) => {
  bot.on(":text", async (ctx) => {
    const fileName = uuid();
    const { text } = ctx.message;
    const path = `${process.cwd()}/uploads/${fileName}.png`;
    await createQr.toFile(path, text, {
      width: 400,
      margin: 4,
    });

    await ctx.replyWithPhoto(new InputFile(path), { caption: text });

    unlink(path, (err) => {
      if (err) throw new Error(err);
    });
  });
};

bot.on(":photo", async (ctx) => {
  const file = await ctx.getFile();
  const fileName = uuid();
  const path = `${process.cwd()}/uploads/${fileName}.png`;

  await file.download();

  const buffer = readFileSync(path);

  Jimp.read(buffer, function (err, image) {
    if (err) throw new Error(err);
  });

  let qrcode = new readQr();

  qrcode.callback = async (error, value) => {
    if (error) {
      const text = "Uzur, tashlagan QR code ingizni o'qish olmadim!";
      return await ctx.reply(text, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
    await ctx.reply(value.result, {
      reply_to_message_id: ctx.message.message_id,
    });
  };

  qrcode.decode(image.bitmap);
  unlink(path, (err) => {
    if (err) throw new Error(err);
  });
});

module.exports = qr;
