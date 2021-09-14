const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/get', (req, res) => {
  const { userId } = req.body;

  db.pool.query('SELECT name FROM tag', (err, tags) => {
    const tagNames = tags.map(({ name }) => name);
    res.json({ err, tags: tagNames });
  });
});

router.post('/post', (req, res) => {
  const { userId, tag } = req.body;

  const sql = `INSERT INTO tag (name) VALUES (${db.escape(tag)})`;

  db.pool.query(sql, (err) => {
    res.json({ err });
  });
});

module.exports = router;
