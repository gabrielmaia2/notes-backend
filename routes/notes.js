const { Router } = require('express');
const db = require('../db');

const router = Router();

function addTagsToNote(noteId, tags, callback) {
  if (!Array.isArray(tags) || tags.length === 0) return;

  let sql = 'INSERT INTO note_tag (note_id, tag_name) VALUES ';

  const rows = [];
  tags.forEach((tag) => rows.push(`(${db.escape(noteId)}, ${db.escape(tag)})`));
  sql += rows.join(', ');

  db.pool.query(sql, (err) => {
    callback(err);
  });
}

function removeTagsFromNote(noteId, tags, callback) {
  if (!tags) return;

  let sql = 'DELETE FROM note_tag (note_id, tag_name) WHERE ';
  sql += `note_id=${db.escape(noteId)} AND (`;

  const rows = [];
  tags.forEach((tag) => rows.push(`tag_name=${db.escape(tag)}`));
  sql += `${rows.join(', ')})`;

  db.pool.query(sql, (err) => {
    callback(err);
  });
}

router.post('/getPreviews', (req, res) => {
  const { userId, search } = req.body;

  let sql = 'SELECT id, title, SUBSTRING(`content`, 1, 700) AS content FROM note ';

  if (search) {
    const searchPattern = db.escape(`%${search}%`);
    sql += `WHERE title LIKE ${searchPattern} OR content LIKE ${searchPattern}`;
  }

  db.pool.query(sql, (err, notes) => {
    res.json({ err, notes });
  });
});

router.post('/get', (req, res) => {
  const { userId, id } = req.body;

  const sql = `SELECT id, title, content FROM note WHERE id=${db.escape(id)}`;

  db.pool.query(sql, (err, notes) => {
    res.json({ err, note: notes[0] });
  });
});

router.post('/post', (req, res) => {
  const {
    userId, title, content, tags
  } = req.body;

  let insertNoteSql = 'INSERT INTO note (title, content) VALUES ';
  insertNoteSql += `(${db.escape(title)}, ${db.escape(content)})`;

  db.pool.query(insertNoteSql, (insertNoteErr, okPacket) => {
    if (insertNoteErr) {
      res.json({ err: insertNoteErr });
      return;
    }

    const getNoteSql = `SELECT id, title, content FROM note WHERE id=${db.escape(okPacket.insertId)}`;

    db.pool.query(getNoteSql, (getNoteErr, notes) => {
      if (getNoteErr) {
        res.json({ err: getNoteErr });
        return;
      }

      if (!Array.isArray(tags) || tags.length === 0) {
        res.json(notes[0]);
      }

      addTagsToNote(notes[0].id, tags, (insertTagsErr) => {
        if (insertTagsErr) {
          res.json({ err: insertTagsErr });
          return;
        }

        res.json(notes[0]);
      });
    });
  });
});

router.put('/put', (req, res) => {
  const {
    userId, id, title, content
  } = req.body;

  let sql = 'INSERT INTO note (id, title, content) VALUES ';
  sql += `(${db.escape(id)}, ${db.escape(title)}, ${db.escape(content)}) AS new `;
  sql += 'ON DUPLICATE KEY UPDATE title=new.title, content=new.content';

  db.pool.query(sql, (err) => {
    res.json({ err });
  });
});

router.post('/delete', (req, res) => {
  const {
    userId, id
  } = req.body;

  const sql = `DELETE FROM note WHERE id=${db.escape(id)}`;

  db.pool.query(sql, (err) => {
    res.json({ err });
  });
});

router.put('/editTags', (req, res) => {
  const {
    userId, id, addTags, removeTags
  } = req.body;

  addTagsToNote(id, addTags, (addTagsErr) => {
    if (addTagsErr) {
      res.json({ err: addTagsErr });
      return;
    }

    removeTagsFromNote(id, removeTags, (removeTagsErr) => res.json({ err: removeTagsErr }));
  });
});

module.exports = router;
