'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContentSchema = new Schema({
  title: String,
  textContent: String,
  imageContent: String,
  imgDescription : [
  {
    description : String,
    id: Number
 
     }],
  videoContent: String,
  active: Boolean
});

module.exports = mongoose.model('Content', ContentSchema);