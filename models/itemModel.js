"use strict";

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const ItemModel = require("./models/itemModel");

async function seed() {
  try {
    const items = [
      {
        prompt: "Test Prompt",
        userEmail: "test@gmail.com",
        imgSrc: "https://i.imgur.com/yg4HTGN.png",
      },
      {
        prompt: "Test Prompt 2",
        userEmail: "test2@gmail.com",
        imgSrc: "https://i.imgur.com/yg4HTGN.png",
      },
      {
        prompt: "Test Prompt 3",
        userEmail: "test3@gmail.com",
        imgSrc: "https://i.imgur.com/yg4HTGN.png",
      },
    ];
    const createdItems = await ItemModel.create(items);
    console.log(`Seeded ${createdItems.length} items`);
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
}

seed();
