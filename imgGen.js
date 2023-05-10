'use strict';

const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const imgGen = async (req, res, next) => {
  try {
    const prompt = req.query.prompt;
    const image = await openai.createImage({
      prompt: `${prompt}`,
      n: 1,
      size: '1024x1024',
    });
    const { data } = image.data;
    const imageUrl = data[0].url;
    res.send(imageUrl);
  } catch (error) {
    next(new Error(error.message));
  }
};

module.exports = imgGen;
