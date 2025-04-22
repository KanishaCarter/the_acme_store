import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Fetch users from the backend API
  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Fetch products from the backend API
  useEffect(() => {
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // Fetch favorites for a user
  const getFavorites = (userId) => {
    fetch(`/api/users/${userId}/favorites`)
      .then((response) => response.json())
      .then((data) => setFavorites(data))
      .catch((error) => console.error('Error fetching favorites:', error));
  };

  // Handle adding a favorite
  const addFavorite = (userId, productId) => {
    fetch(`/api/users/${userId}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    })
      .then((response) => response.json())
      .then((newFavorite) => setFavorites((prev) => [...prev, newFavorite]))
      .catch((error) => console.error('Error adding favorite:', error));
  };

  // Handle deleting a favorite
  const deleteFavorite = (userId, favoriteId) => {
    fetch(`/api/users/${userId}/favorites/${favoriteId}`, { method: 'DELETE' })
      .then(() => setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId)))
      .catch((error) => console.error('Error deleting favorite:', error));
  };

  return (
    <div>
      <h1>Vite + React</h1>

      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username} 
              <button onClick={() => getFavorites(user.id)}>View Favorites</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name}
              <button onClick={() => addFavorite(users[0].id, product.id)}>Add to Favorites</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Favorites</h2>
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite.id}>
              Product: {favorite.product_id} 
              <button onClick={() => deleteFavorite(users[0].id, favorite.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;


