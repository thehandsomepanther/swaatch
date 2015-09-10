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
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date
  },
  importance_delta: {
    type: Number,
    default: 0
  },
  urgency_delta: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Swatch', SwatchSchema);