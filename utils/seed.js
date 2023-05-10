"use strict";

const mongoose = require("mongoose");
const ItemModel = require("../models/itemModel");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

async function seed() {
  try {
    // seed the database with some cats, so I can retrieve them
    await ItemModel.create({
      prompt: "Test Prompt",
      userEmail: "test@gmail.com",
      imgSrc: "https://i.imgur.com/yg4HTGN.png",
    });
    console.log("seeded test");
    await ItemModel.create({
      prompt: "Test Prompt 2",
      userEmail: "test2@gmail.com",
      imgSrc: "https://i.imgur.com/yg4HTGN.png",
    });
    console.log("seeded test2");
    await ItemModel.create({
      prompt: "Test Prompt 3",
      userEmail: "test3@gmail.com",
      imgSrc: "https://i.imgur.com/yg4HTGN.png",
    });
    console.log("seeded test3");
    mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

seed();
