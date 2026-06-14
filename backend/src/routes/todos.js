const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. GET ALL NOTES
router.get('/', async (req, res) => {
  try {
    // Sort by id so sticky notes stay in the same order on screen layout refresh
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST A NEW NOTE (Captures all your NoteModal settings)
router.post('/', async (req, res) => {
  const { title, color, style, status, tasks, x, y, width, height } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO todos (title, color, style, status, tasks, x, y, width, height) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        title, 
        color || 'yellow', 
        style || 'plain', 
        status || 'empty', 
        JSON.stringify(tasks || []), // Array must be turned into a JSON string for Postgres
        x || 150, 
        y || 100, 
        width || 150, 
        height || 150
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. PUT (Update layout coordinates during drag or resize)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, color, style, status, tasks, x, y, width, height } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE todos 
       SET title = $1, color = $2, style = $3, status = $4, tasks = $5, x = $6, y = $7, width = $8, height = $9 
       WHERE id = $10 RETURNING *`,
      [title, color, style, status, JSON.stringify(tasks), x, y, width, height, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. DELETE A NOTE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
