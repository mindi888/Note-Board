const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all todos
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  res.json(result.rows);
});

// POST a new todo
router.post('/', async (req, res) => {
  const { title } = req.body; // get the title from the req body
  const result = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *',
    [title] // use parameterized query to prevent SQL injection, replaces $1 with the value of title
  );
  res.status(201).json(result.rows[0]);
});

// PUT (update) a todo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const result = await pool.query(
    'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
    [title, completed, id]
  );
  res.json(result.rows[0]);
});

// DELETE a todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM todos WHERE id = $1', [id]);
  res.status(204).send();
});

module.exports = router;