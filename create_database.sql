CREATE DATABASE IF NOT EXISTS notes_db;
USE notes_db;

CREATE TABLE IF NOT EXISTS note (
  id SERIAL,
  title VARCHAR(256) NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tag (
  name VARCHAR(32) UNIQUE NOT NULL,
  PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS note_tag (
  note_id BIGINT UNSIGNED NOT NULL,
  tag_name VARCHAR(32) NOT NULL,
  PRIMARY KEY (note_id, tag_name),
  CONSTRAINT fk_note_tag_note_id
  FOREIGN KEY (note_id)
    REFERENCES note(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_note_tag_tag_name
  FOREIGN KEY (tag_name)
    REFERENCES tag(name)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
