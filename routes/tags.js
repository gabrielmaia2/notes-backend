const { Router } = require('express');
const db = require('../db');

const router = Router();

router.post('/get', (req, res) => {
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

router.put('/put', (req, res) => {
  const { userId, oldTag, newTag } = req.body;

  const sql = `UPDATE tag SET name=${db.escape(newTag)} WHERE name=${db.escape(oldTag)}`;

  db.pool.query(sql, (err) => {
    res.json({ err });
  });
});

router.delete('/delete', (req, res) => {
  const { userId, tag } = req.body;

  const sql = `DELETE FROM tag WHERE name=${db.escape(tag)}`;

  db.pool.query(sql, (err) => {
    res.json({ err });
  });
});

module.exports = router;
