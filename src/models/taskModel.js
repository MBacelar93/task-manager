const { db } = require('../database/db');

const getAllTasks = (callback) => {
  const query = 'SELECT * FROM tasks ORDER BY created_at DESC';

  db.all(query, [], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};

const getTaskById = (id, callback) => {
  const query = 'SELECT * FROM tasks WHERE id = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
};

const createTask = (title, description, callback) => {
  const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';

  db.run(query, [title, description], function (err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, this.lastID);
    }
  });
};

const updateTask = (id, title, description, completed, callback) => {
  const query = `
    UPDATE tasks
    SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [title, description, completed, id], function (err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, this.changes);
    }
  });
};

const deleteTask = (id, callback) => {
  const query = 'DELETE FROM tasks WHERE id = ?';

  db.run(query, [id], function (err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, this.changes);
    }
  });
};

const toggleTaskCompletion = (id, callback) => {
  const query = `
    UPDATE tasks
    SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [id], function (err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, this.changes);
    }
  });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
};