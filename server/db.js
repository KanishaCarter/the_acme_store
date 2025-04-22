const pg = require('pg');
const bcrypt = require('bcrypt');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store');

// createTables
const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );

    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE favorites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      UNIQUE(user_id, product_id)
    );
  `;
  await client.query(SQL);
};

// createProduct
const createProduct = async (name) => {
  const { rows } = await client.query(
    'INSERT INTO products(name) VALUES($1) RETURNING *',
    [name]
  );
  return rows[0];
};

// createUser
const createUser = async ({ username, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await client.query(
    'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *',
    [username, hashedPassword]
  );
  return rows[0];
};

// fetchUsers
const fetchUsers = async () => {
  const { rows } = await client.query('SELECT id, username FROM users');
  return rows;
};

// fetchProducts
const fetchProducts = async () => {
  const { rows } = await client.query('SELECT * FROM products');
  return rows;
};

// createFavorite
const createFavorite = async ({ user_id, product_id }) => {
  const { rows } = await client.query(
    'INSERT INTO favorites(user_id, product_id) VALUES($1, $2) RETURNING *',
    [user_id, product_id]
  );
  return rows[0];
};

// fetchFavorites
const fetchFavorites = async (user_id) => {
  const { rows } = await client.query(
    'SELECT * FROM favorites WHERE user_id = $1',
    [user_id]
  );
  return rows;
};

// destroyFavorite
const destroyFavorite = async (id) => {
  await client.query('DELETE FROM favorites WHERE id = $1', [id]);
};

module.exports = {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
