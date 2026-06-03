import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css';

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      {recipe.image ? (
        <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="recipe-card-img" />
      ) : (
        <div className="recipe-card-img-placeholder">No Image</div>
      )}
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-desc">{recipe.description.substring(0, 80)}...</p>
        <div className="recipe-card-meta">
          <span className="recipe-card-category">{recipe.category}</span>
          {recipe.cookTime && <span>{recipe.cookTime} min</span>}
        </div>
        <p className="recipe-card-author">by {recipe.author?.username}</p>
        <Link to={`/recipe/${recipe._id}`} className="btn-view">View Recipe</Link>
      </div>
    </div>
  );
}

export default RecipeCard;
