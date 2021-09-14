const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/get', (req, res) => {
  const { userId, search } = req.body;

  const searchPattern = db.escape(`%${search}%`);
  let sql = 'SELECT id, title, content FROM note WHERE ';
  sql += `title LIKE ${searchPattern} OR content LIKE ${searchPattern}`;

  db.pool.query(sql, (err, notes) => {
    res.json({ err, notes });
  });
});

module.exports = router;
