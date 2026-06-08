const express = require('express');
const pool = require('./db');
const todosRouter = require('./routes/todos');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/todos', todosRouter);

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

init();