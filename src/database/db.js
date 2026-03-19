const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../task_manager.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar no banco de dados', err.massage);
    }else {
        console.log('✅ Conectado ao banco de dados SQLite');
    }
});

const initializeDatabase = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            completed INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Erro ao criar tabela:', err.message);
        } else {
            console.log('✅ Tabela de tarefas pronta');
        }
    });
};

module.exports = {
    db,
    initializeDatabase
};