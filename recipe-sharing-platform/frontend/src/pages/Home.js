import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import './Home.css';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = { page, sort };
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await axios.get('/api/recipes', { params });
      setRecipes(res.data.recipes);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, [page, sort, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecipes();
  };

  return (
    <div className="container home-page">
      <h1 className="home-title">Browse Recipes</h1>

      <div className="home-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-search">Search</button>
        </form>

        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="filter-select">
          <option value="">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
          <option value="dessert">Dessert</option>
          <option value="other">Other</option>
        </select>

        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="filter-select">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">A-Z</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <>
          <div className="recipe-grid">
            {recipes.length > 0 ? (
              recipes.map(r => <RecipeCard key={r._id} recipe={r} />)
            ) : (
              <p>No recipes found.</p>
            )}
          </div>

          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
