const { db } = require('../database/db');

const getGeneralStats = (callback) => {
    const query = `
        SELECT COUNT(*) as total,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending
        FROM tasks
    `;

    db.get(query, [], (err, row) => {
        if (err) {
            callback(err, null);
        } else {

            const stats = {
                total: row.total || 0,
                completed: row.completed || 0,
                pending: row.peding || 0,
                percentage: row.total > 0 ? Math.round((row.completed/row.total)*100) : 0
            };

            callback(null, stats);

        }
    });

};

const getAllTasks = (callback) => {
    const query = `
        SELECT
            id,
            title,
            description,
            completed,
            created_at,
            update_at
        FROM tasks
        ORDER BY created_at DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
           callback(err, null); 
        } else {
            callback(null, rows || []);
        }
    });
};

const getTasksByStatus = (callback) => {
    const query = `
        SELECT
            completed,
            COUNT (*) as count,
            GROUP_CONCAT(title, ',') as titles
        FROM tasks
        GROUP by completed
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            const result = {
                completed: [],
                pending: []
            };
            
            rows.forEach(row => {
                if (row.completed === 1){
                    result.completed = {
                        count: row.count,
                        titles: row.titles ? row.titles.split(', '): []
                    };
                } else {
                    result.pending = {
                        count: row.count,
                        titles: row.titles ? row.titles.split(', '): []
                    };
                }
            });
            callback(null, result);
        }
    });
};

const getTasksByDate = (callback) => {
    const query = `
        SELETC
            DATE (created_at) as date,
            COUNT(*) as count
        FROM tasks
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
    `;

    db.all (query, [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows || []);
        }
    });
};


const getCompletionRate = (callback) => {
    const query = `
        SELECT 
            DATE(created_at) as date,
            SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
            COUNT(*) as total
        FROM tasks
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30   
    `;

    db.all (query, [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            const data = (rows || []).map(row =>({
                date: row.date,
                completed: row.completed || 0,
                total: row.total > 0 ? Math.round((row.completed / row.total)*100) : 0
            }));
            callback(null, data);
        }
    });
};


module.exports = {
    getGeneralStats,
    getAllTasks,
    getTasksByStatus,
    getTasksByDate,
    getCompletionRate
};