const { Keyboard } = require("grammy");

const homeBtn = new Keyboard()
  .text(" 🇷🇺 cyrillic-to-latin 🇺🇸")
  .text(" 🇺🇸 latin-to-cyrillic 🇷🇺")
  .row()
  .text("Create QR code")
  .text("Read QR code");

module.exports = homeBtn;
