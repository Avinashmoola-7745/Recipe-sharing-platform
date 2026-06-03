import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RecipeForm.css';

function CreateRecipe() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    category: 'other',
    cookTime: '',
    servings: '',
    tags: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('category', form.category);
    if (form.cookTime) data.append('cookTime', form.cookTime);
    if (form.servings) data.append('servings', form.servings);

    const ingredients = form.ingredients.split('\n').map(i => i.trim()).filter(Boolean);
    const steps = form.steps.split('\n').map(s => s.trim()).filter(Boolean);
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);

    data.append('ingredients', JSON.stringify(ingredients));
    data.append('steps', JSON.stringify(steps));
    data.append('tags', JSON.stringify(tags));

    if (image) data.append('image', image);

    try {
      await axios.post('/api/recipes', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recipe');
    }
  };

  return (
    <div className="container recipe-form-page">
      <h2>Add New Recipe</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label>Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
              <option value="dessert">Dessert</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Cook Time (min)</label>
            <input type="number" name="cookTime" value={form.cookTime} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Servings</label>
            <input type="number" name="servings" value={form.servings} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Ingredients (one per line) *</label>
          <textarea name="ingredients" value={form.ingredients} onChange={handleChange} rows={5} placeholder="2 cups flour&#10;1 tsp salt&#10;..." required />
        </div>
        <div className="form-group">
          <label>Steps (one per line) *</label>
          <textarea name="steps" value={form.steps} onChange={handleChange} rows={5} placeholder="Mix the flour and salt&#10;Add water gradually&#10;..." required />
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="vegan, quick, healthy" />
        </div>
        <div className="form-group">
          <label>Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <button type="submit" className="btn-submit">Post Recipe</button>
      </form>
    </div>
  );
}

export default CreateRecipe;
