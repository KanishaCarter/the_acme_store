const express = require('express');
const app = express();
const {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require('./db');

app.use(express.json());

// GET /api/users
app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (err) {
    next(err);
  }
});

// GET /api/products
app.get('/api/products', async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id/favorites
app.get('/api/users/:id/favorites', async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (err) {
    next(err);
  }
});

// POST /api/users/:id/favorites
app.post('/api/users/:id/favorites', async (req, res, next) => {
  try {
    const favorite = await createFavorite({
      user_id: req.params.id,
      product_id: req.body.product_id,
    });
    res.status(201).send(favorite);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/users/:userId/favorites/:id
app.delete('/api/users/:userId/favorites/:id', async (req, res, next) => {
  try {
    await destroyFavorite(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

const init = async () => {
  try {
    await client.connect();
    console.log('connected to database');
    
    await createTables();
    console.log('tables created');

    // Generates dummy data
    const [user1, user2] = await Promise.all([
      createUser({ username: 'moe', password: 'moe_pw' }),
      createUser({ username: 'lucy', password: 'lucy_pw' }),
    ]);

    const [product1, product2, product3] = await Promise.all([
      createProduct('product1'),
      createProduct('product2'),
      createProduct('product3'),
    ]);

    app.listen(3000, () => console.log('listening on port 3000'));
  } catch (err) {
    console.error(err);
  }
};

init();


