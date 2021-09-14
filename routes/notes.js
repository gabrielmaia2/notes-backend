const { Router } = require('express');
const db = require('../db');

const router = Router();

function addTagsToNote(noteId, tags, callback) {
  let sql = 'INSERT INTO note_tag (note_id, tag_name) VALUES ';

  const rows = [];
  tags.forEach((tag) => rows.push(`(${db.escape(noteId)}, ${db.escape(tag)})`));
  sql += rows.join(', ');

  db.pool.query(sql, (err) => {
    callback(err);
  });
}

router.get('/get', (req, res) => {
  const { userId, search } = req.body;

  const searchPattern = db.escape(`%${search}%`);
  let sql = 'SELECT id, title, content FROM note WHERE ';
  sql += `title LIKE ${searchPattern} OR content LIKE ${searchPattern}`;

  db.pool.query(sql, (err, notes) => {
    res.json({ err, notes });
  });
});

router.post('/post', (req, res) => {
  const {
    userId, title, content, tags
  } = req.body;

  let sql = 'INSERT INTO note (title, content) VALUES';
  sql += `(${db.escape(title)}, ${db.escape(content)})`;

  db.pool.query(sql, (insertNoteErr, rows) => {
    if (insertNoteErr) {
      res.json({ err: insertNoteErr });
      return;
    }

    addTagsToNote(rows[0].id, tags, (insertTagsErr) => res.json({ err: insertTagsErr }));
  });
});

router.put('/put', (req, res) => {
  const {
    userId, id, title, content
  } = req.body;

  let sql = 'INSERT INTO note (id, title, content) VALUES ';
  sql += `(${id}, ${db.escape(title)}, ${db.escape(content)}) `;
  sql += 'ON DUPLICATE KEY UPDATE';

  db.pool.query(sql, (err) => {
    res.json({ err });
  });
});

router.delete('/delete', (req, res) => {
  const {
    userId, id
  } = req.body;

  const sql = `DELETE FROM note WHERE id=${db.escape(id)}`;

  db.pool.query(sql, (err) => {
    res.json({ err });
  });
});

module.exports = router;
