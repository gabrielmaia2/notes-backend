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

module.exports = router;
