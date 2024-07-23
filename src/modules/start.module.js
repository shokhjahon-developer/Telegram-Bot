const { Router } = require("@grammyjs/router");
const latinToCyrillic = require("latin-to-cyrillic");
const cyrillicToLatin = require("cyrillic-to-latin");
const { unlink, readFileSync } = require("fs");
const { InputFile } = require("grammy");
const createQr = require("qrcode");
const { v4: uuid } = require("uuid");
const readQr = require("qrcode-reader");
const Jimp = require("jimp");

const router = new Router((ctx) => ctx.session.step);

const start = router.route("start");

start.hears("🇺🇸 latin-to-cyrillic 🇷🇺", async (ctx) => {
  await ctx.reply("Matnni kiriting!");
  ctx.session.step = "conversedCyrillic";
});

const text = router.route("conversedCyrillic");
text.on("message", async (ctx) => {
  const result = await latinToCyrillic(ctx.message.text);
  await ctx.reply(result);

  ctx.session.step = "cyrillic";
});

start.hears("🇷🇺 cyrillic-to-latin 🇺🇸", async (ctx) => {
  await ctx.reply("Matnni kiriting!");
  ctx.session.step = "conversedLatin";
});
const latin = router.route("conversedLatin");
latin.on("message", async (ctx) => {
  const result = await cyrillicToLatin(ctx.message.text, true);
  await ctx.reply(result);
  ctx.session.step = "conversed";
});

start.hears("Read QR code", async (ctx) => {
  await ctx.reply("QR codingizni yuboring!");
  ctx.session.step = "readQr";
});

const readqr = router.route("readQr");
readqr.on(":photo", async (ctx) => {
  const file = await ctx.getFile();
  const fileName = uuid();
  const path = `${process.cwd()}/uploads/${fileName}`;

  await file.download(path);

  const buffer = readFileSync(path);

  Jimp.read(buffer, function (err, image) {
    if (err) throw new Error(err);

    let qrcode = new readQr();

    qrcode.callback = async (error, value) => {
      if (error) {
        const text = "Uzur, tashlagan QR code ingizni o'qiy olmadim!";
        return await ctx.reply(text, {
          reply_to_message_id: ctx.message.message_id,
        });
      }
      await ctx.reply(value.result, {
        reply_to_message_id: ctx.message.message_id,
      });
    };

    qrcode.decode(image.bitmap);
  });

  unlink(path, (err) => {
    if (err) throw new Error(err);
  });

  ctx.session.step = "read";
});

start.hears("Create QR code", async (ctx) => {
  await ctx.reply("URL ni yuboring!");
  ctx.session.step = "createqr";
});

const create = router.route("createqr");
create.on(":text", async (ctx) => {
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

module.exports = router;
