const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    telegramID: {
      type: Number,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = model("User", schema);
