'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Item = require('./models/itemModel');
// const verifyUser = require('./auth');

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
app.put('/item/:id', handlePutPrompts);
app.delete('/item/:id', handleDeletePrompts);

async function handleGenerateImg(req, res, next) {
  try {
    const generatedImg = await openai.createImage({
      prompt: req.body.prompt,
      n: 1,
      size: "256x256",
    });
    res.send(generatedImg.data);
  } catch (error) {
    next(error);
    res.status(500).send('Error Generating Img');
  }
}


async function handleGetPrompts(req, res, next) {
  // verifyUser(req, async (err, user) => {
  //   if (err) {
  //     console.log(err);
  //     res.send('invalid token');
  //   } else {


      try {
        let queryObject = {}
        if (req.query.email) {
          queryObject.email = req.query.email;
        }
        let results = await Item.find(queryObject);
        res.status(200).send(results);

      } catch (error) {
        next(error);
        res.status(500).send('Error Getting Prompts');
      }

    }
  // });
// };



async function handlePostPrompts(req, res, next) {
  try {
    const newItem = await Item.create(req.body);
    res.send(newItem);

  } catch (error) {
    next(error);
    res.status(500).send('Error Creating Item');
  }
}



async function handlePutPrompts(req, res, next) {
  try {
    let id = req.params.id;
    let updatedItemData = req.body;
    let updatedItem = await Item.findByIdAndUpdate(id, updatedItemData, { new: true, overwrites: true });
    res.status(200).send(updatedItem);
  } catch (error) {
    next(error);
    res.status(500).send('Error Updating Prompt');
  }
}

async function handleDeletePrompts(req, res, next) {
  try {
    console.log(req.params.id);
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
