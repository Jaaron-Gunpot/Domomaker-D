const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setColor = (color) => _.escape(color).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
    set: setColor,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
