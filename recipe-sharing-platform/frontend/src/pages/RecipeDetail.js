import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => setError('Recipe not found'));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await axios.delete(`/api/recipes/${id}`);
      navigate('/');
    } catch (err) {
      setError('Could not delete recipe');
    }
  };

  if (error) return <div className="container"><p className="error-msg">{error}</p></div>;
  if (!recipe) return <div className="container"><p>Loading...</p></div>;

  const isAuthor = user && recipe.author && user._id === recipe.author._id;

  return (
    <div className="container recipe-detail">
      {recipe.image && (
        <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="detail-img" />
      )}
      <div className="detail-header">
        <h1>{recipe.title}</h1>
        <span className="detail-category">{recipe.category}</span>
      </div>

      <p className="detail-author">Posted by <strong>{recipe.author?.username}</strong></p>
      <p className="detail-desc">{recipe.description}</p>

      <div className="detail-meta">
        {recipe.cookTime && <span>Cook Time: {recipe.cookTime} min</span>}
        {recipe.servings && <span>Servings: {recipe.servings}</span>}
      </div>

      {recipe.tags?.length > 0 && (
        <div className="detail-tags">
          {recipe.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
        </div>
      )}

      <div className="detail-section">
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>
      </div>

      <div className="detail-section">
        <h3>Steps</h3>
        <ol>
          {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </div>

      {isAuthor && (
        <div className="detail-actions">
          <Link to={`/edit/${recipe._id}`} className="btn-edit">Edit</Link>
          <button onClick={handleDelete} className="btn-delete">Delete</button>
        </div>
      )}
    </div>
  );
}

export default RecipeDetail;
