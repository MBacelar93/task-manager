const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database/db');
const taskRoutes = require ('./routes/taskRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = 3000;


// MIDDLEWARES
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());
db.initializeDatabase();

// ROTAS

app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`
 ╔════════════════════════════════════════╗
    ║   TASK MANAGER - SERVIDOR INICIADO    ║
    ╠════════════════════════════════════════╣
    ║  URL: http://localhost:${PORT}           ║
    ║  Pressione Ctrl+C para parar           ║
    ╚════════════════════════════════════════╝
    `);
});
 
module.exports = app;