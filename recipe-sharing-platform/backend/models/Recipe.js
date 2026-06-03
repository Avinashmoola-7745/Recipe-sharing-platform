const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  steps: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'other'],
    default: 'other'
  },
  cookTime: {
    type: Number
  },
  servings: {
    type: Number
  },
  image: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String]
}, { timestamps: true });

recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
