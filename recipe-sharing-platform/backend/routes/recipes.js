const express = require('express');
const { body } = require('express-validator');
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);

router.post('/', protect, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
], createRecipe);

router.put('/:id', protect, upload.single('image'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
