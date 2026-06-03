const { validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');

const getRecipes = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      title: { title: 1 }
    };

    const sortBy = sortOptions[sort] || sortOptions.newest;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const recipes = await Recipe.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username');

    const total = await Recipe.countDocuments(query);

    res.json({
      recipes,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createRecipe = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = {
      ...req.body,
      author: req.user._id
    };

    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }

    if (typeof data.ingredients === 'string') {
      data.ingredients = JSON.parse(data.ingredients);
    }
    if (typeof data.steps === 'string') {
      data.steps = JSON.parse(data.steps);
    }
    if (typeof data.tags === 'string') {
      data.tags = JSON.parse(data.tags);
    }

    const recipe = await Recipe.create(data);
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    if (typeof updates.ingredients === 'string') updates.ingredients = JSON.parse(updates.ingredients);
    if (typeof updates.steps === 'string') updates.steps = JSON.parse(updates.steps);
    if (typeof updates.tags === 'string') updates.tags = JSON.parse(updates.tags);

    const updated = await Recipe.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe };
