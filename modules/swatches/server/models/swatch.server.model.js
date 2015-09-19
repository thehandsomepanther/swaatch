'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Swatch Schema
 */
var SwatchSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Swatch title',
    trim: true
  },
  description: {
    type: String,
    default: ' ',
    trim: true
  },
  importance: {
    type: Number,
    default: 50,
    required: 'Please fill swatch importance',
    max: 100,
    min: 0
  },
  urgency: {
    type: Number,
    default: 50,
    required: 'Please fill swatch urgency',
    max: 100,
    min: 0
  },
  color: {
    type: String
  },
  priority: {
    type: Number
  },
  completed: {
    type: Boolean,
    default: false
  },
  created: {
    type: Number,
    default: Date.now()
  },
  due_date: {
    type: Number
  },
  importance_delta: {
    type: Number,
    default: 0
  },
  urgency_delta: {
    type: Number,
    default: 0
  },
  comments: [{
    body: {
      type: String,
      required: 'Comment cannot be blank'
    },
    created: {
      type: Number,
      default: Date.now()
    }
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Swatch', SwatchSchema);
