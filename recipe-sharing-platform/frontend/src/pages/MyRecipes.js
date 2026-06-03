import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import './MyRecipes.css';

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await axios.get('/api/recipes', { params: { limit: 100 } });
        const mine = res.data.recipes.filter(r => r.author?._id === user._id);
        setRecipes(mine);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    if (user) fetchMyRecipes();
  }, [user]);

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container my-recipes-page">
      <h2>My Recipes</h2>
      {recipes.length === 0 ? (
        <p>You haven't posted any recipes yet.</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map(r => <RecipeCard key={r._id} recipe={r} />)}
        </div>
      )}
    </div>
  );
}

export default MyRecipes;
