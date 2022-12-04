'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Item = require('./models/itemModel');
const verifyUser = require('./auth.js');
const axios = require("axios");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGO_URL)


app.get('/item', handleGetPrompts);
app.post('/item', handlePostPrompts);
app.post('/item/generate', handleGenerateImg);
app.post('/item/emotion', handleGetImgEmotion);
app.put('/item/:id', handlePutPrompts);
app.delete('/item/:id', handleDeletePrompts);

async function handleGenerateImg(req, res, next) {
  try {
    const generatedImg = await openai.createImage({
      prompt: req.body.prompt,
      n: 5,
      size: "256x256",
    });
    res.send(generatedImg.data);
  } catch (error) {
    next(error);
    res.status(500).send('Error Generating Img');
  }
}
//     data: {"url": req.body.url}
async function handleGetImgEmotion (req,res,next) {
  //
   const dataUrl =  req.body.url;
  // const dataUrl = "https://i.imgur.com/tGTPg1E.png"
  console.log(dataUrl);
  
  const options = {
    method: 'POST',
    url: 'https://emotion-detection2.p.rapidapi.com/emotion-detection',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': ` ${process.env.EMOTION_API_KEY}`,
      'X-RapidAPI-Host': 'emotion-detection2.p.rapidapi.com'
    },
    data: {"url":dataUrl}
  };
  console.log(options);
  axios.request(options).then(function (response) {
    console.log(response.data);
    res.send(response.data)
  }).catch(function (error) {
    console.error(error);
});
}


async function handleGetPrompts(req, res, next) {
  // console.log(req.headers.authorization);
  verifyUser(req, async (err, user) => {
    if (err) {
      console.log(err);
      res.send('invalid token');
    } else {
      console.log('successful verification');
      try {
        const queryObject = {}
        if (req.query.email) {
          queryObject.userEmail = req.query.email;
        }
        let results = await Item.find(queryObject);
        res.status(200).send(results);
      } catch (error) {
        next(error);
        res.status(500).send('Error Getting Prompts');
      }
    }
  });
}


async function handlePostPrompts(req, res, next) {
  try {
    // const sentObj = req.body;
    // let config = {
    //   method: 'get',
    //   url: "https://shot.screenshotapi.net/screenshot",
    //   params: {
    //     "token" :`${process.env.SCREENSHOT_API_KEY}`,
    //     "url" : `${sentObj.imgSrc}`,
    //     "width" : 256,
    //     "height" : 256
    //   }
    // }
    // const screenShot = await axios(config);
    // const objWithStableSrc = {
    //   prompt: sentObj.prompt,
    //   userEmail: sentObj.userEmail,
    //   imgSrc: screenShot.data.screenshot
    // }
    const newItem = await Item.create(req.body);
    res.send(newItem);
  } catch (error) {
    next(error);
    console.log(error);
    res.status(500).send('Error Creating Item');
  }
}


async function handlePutPrompts(req, res, next) {
  try {
    // const sentObj = req.body;
    // let config = {
    //   method: 'get',
    //   url: "https://shot.screenshotapi.net/screenshot",
    //   params: {
    //     "token" :`${process.env.SCREENSHOT_API_KEY}`,
    //     "url" : `${sentObj.imgSrc}`,
    //     "width" : 256,
    //     "height" : 256
    //   }
    // }
    // const screenShot = await axios(config);
    // const objWithStableSrc = {
    //   prompt: sentObj.prompt,
    //   userEmail: sentObj.userEmail,
    //   imgSrc: screenShot.data.screenshot
    // }
    let id = req.params.id;
    let updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true, overwrites: true });
    res.status(200).send(updatedItem);
  } catch (error) {
    next(error);
    res.status(500).send('Error Updating Prompt');
  }
}


async function handleDeletePrompts(req, res, next) {
  try {
    // console.log(req.params.id);
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).send('item is Gone Forever <:O');
  } catch (error) {
    next(error);
    res.status(500).send('Error Deleting Prompt');
  }
}



app.get('/', (req, res) => {
  res.send('Home')
})
app.get('*', (req, res) => {
  res.status(404).send('Not available');
});



app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});
