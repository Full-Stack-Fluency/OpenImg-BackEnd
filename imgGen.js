'use strict';
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


async function imgGen(req, res, next) {
  try{
      let createPrompt = req.query.prompt;
      //let generator = await axios.get(`https://api.openai.com/v1/images/generations?api_key=${process.env.MOVIE_API_KEY}&query=${searchedCity}`);
      let generator = await openai.createImage({
        prompt: `${createPrompt}`,
        n: 1,
        size: '1024x1024'
      });
      image_url = generator.data.data[0].url;
      res.send(image_url);
  } catch (error) {
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
  }
}


// class Img {
//   constructor(obj) {
//     this.tbd = obj.tbd;
//     this.tbd = obj.tbd;
//     this.tbd = obj.tbd;
//   }
// }

module.exports = imgGen;
