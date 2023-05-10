'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Item = require('./models/itemModel');
const verifyUser = require('./auth.js');
const axios = require('axios');

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGO_URL);

app.get('/item', handleGetItems);
app.post('/item', handlePostItem);
app.post('/item/generate', handleGenerateImage);
app.post('/item/emotion', handleGetImageEmotion);
app.put('/item/:id', handlePutItem);
app.delete('/item/:id', handleDeleteItem);

async function handleGenerateImage(req, res, next) {
  try {
    console.log(typeof req.body.prompt);
    const ModeratedPrompt = await openai.createModeration({
      input: req.body.prompt,
    });
    console.log(typeof ModeratedPrompt.data.results[0].flagged);
    if (ModeratedPrompt.data.results[0].flagged === false) {
      console.log('generating image');
      const generatedImg = await openai.createImage({
        prompt: req.body.prompt,
        n: 4,
        size: '256x256',
      });
      res.send(generatedImg.data);
    } else {
      console.log('prompt flagged');
      res.send(ModeratedPrompt.data.results[0].flagged);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error Generating Image');
  }
}

async function handleGetImageEmotion(req, res, next) {
  try {
    const dataUrl = req.body.url;
    const options = {
      method: 'POST',
      url: 'https://emotion-detection2.p.rapidapi.com/emotion-detection',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.EMOTION_API_KEY,
        'X-RapidAPI-Host': 'emotion-detection2.p.rapidapi.com',
      },
      data: { url: dataUrl },
    };
    console.log(options);
    const response = await axios.request(options);
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error Getting Image Emotion');
  }
}

async function handleGetItems(req, res, next) {
  try {
    verifyUser(req, async (err, user) => {
      if (err) {
        console.log(err);
        res.send('Invalid token');
      } else {
        console.log('Successful verification');
        const queryObject = {};
        if (req.query.email) {
          queryObject.userEmail = req.query.email;
        }
        const results = await Item.find(queryObject);
        res.status(200).send(results);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error Getting Items');
  }
}

async function handlePostItem(req, res, next) {
  try {
    const newItem = await Item.create(req.body);
    res.send(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error Creating Item');
  }
}

async function handlePutItem(req, res, next)
