'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;
const ItemSchema = new Schema ({
    prompt:{type: String, required: true},
    userEmail:{type: String, required: true},
    imgSrc:{type: String, required: true}
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;