const ReportModel = require('../models/reportModel');

const getGeneralStats = (req, res) => {
    ReportModel.getGeneralStats((err, stats) => {
        if (err) {
            return res.status(500).json({
                error: 'Erro ao buscar estatísticas',
                message: err.message
            });
        }

        res.status(200).json(stats);
    });
};

const getFullReport = (req, res) => {
    let stats;
    let tasks;
    let tasksByStatus;
    let tasksByDate;
    let completionRate;

    let completedCallbacks = 0;
    const totalCallbacks = 5;
    let hasError = false;

    const checkComplete = () => {
        completedCallbacks++;

        if (completedCallbacks === totalCallbacks && !hasError) {
            res.status(200).json({
                stats,
                tasks,
                tasksByStatus,
                tasksByDate,
                completionRate
            });
        }
    };

    ReportModel.getGeneralStats((err, data) => {
        if (err) {
            hasError = true;
            return res.status(500).json({
                error: 'Erro ao buscar estatísticas',
                message: err.message
            });
        }

        stats = data;
        checkComplete();
    });

    ReportModel.getAllTasks((err, data) => {
        if (err) {
            hasError = true;
            return res.status(500).json({
                error: 'Erro ao buscar tarefas',
                message: err.message
            });
        }

        tasks = data;
        checkComplete();
    });

    ReportModel.getTasksByStatus((err, data) => {
        if (err) {
            hasError = true;
            return res.status(500).json({
                error: 'Erro ao buscar tarefas por status',
                message: err.message
            });
        }

        tasksByStatus = data;
        checkComplete();
    });

    ReportModel.getTasksByDate((err, data) => {
        if (err) {
            hasError = true;
            return res.status(500).json({
                error: 'Erro ao buscar tarefas por data',
                message: err.message
            });
        }

        tasksByDate = data;
        checkComplete();
    });

    ReportModel.getCompletionRate((err, data) => {
        if (err) {
            hasError = true;
            return res.status(500).json({
                error: 'Erro ao buscar taxa de conclusão',
                message: err.message
            });
        }

        completionRate = data;
        checkComplete();
    });
};

const getStatsForChart = (req, res) => {
    ReportModel.getTasksByStatus((err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Erro ao buscar dados para gráfico',
                message: err.message
            });
        }

        const chartData = {
            labels: ['Concluídas', 'Pendentes'],
            datasets: [
                {
                    label: 'Tarefas',
                    data: [
                        data.completed.count || 0,
                        data.pending.count || 0
                    ],
                    backgroundColor: [
                        '#27ae60',
                        '#e74c3c'
                    ],
                    borderColor: [
                        '#229954',
                        '#c0392b'
                    ],
                    borderWidth: 2
                }
            ]
        };

        res.status(200).json(chartData);
    });
};

const getCSVData = (req, res) => {
    ReportModel.getAllTasks((err, tasks) => {
        if (err) {
            return res.status(500).json({
                error: 'Erro ao gerar CSV',
                message: err.message
            });
        }

        let csv = 'ID,Título,Descrição,Status,Data de Criação,Data de Atualização\n';

        tasks.forEach((task) => {
            const status = task.completed === 1 ? 'Concluída' : 'Pendente';
            const description = task.description ? task.description.replace(/,/g, ';') : '';

            csv += `${task.id},"${task.title}","${description}",${status},${task.created_at},${task.updated_at}\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="relatorio_tarefas.csv"');
        res.send(csv);
    });
};

const getPDFData = (req, res) => {
    let stats;
    let tasks;
    let tasksByStatus;

    let completedCallbacks = 0;
    const totalCallbacks = 3;
    let hasError = false;

    const checkComplete = () => {
        completedCallbacks++;

        if (completedCallbacks === totalCallbacks && !hasError) {
            res.status(200).json({
                stats,
                tasks,
                tasksByStatus
            });
        }
    };

    ReportModel.getGeneralStats((err, data) => {
        if (err) {
            hasError = true;
            return res.status(500).json({
                error: 'Erro ao buscar estatísticas',
                message: err.message
            });
        }

        stats = data;
        checkComplete();
    });

    ReportModel.getAllTasks((err, data) => {
        if (err) {
            hasError = true;
            return res.status(500).json({
                error: 'Erro ao buscar tarefas',
                message: err.message
            });
        }

        tasks = data;
        checkComplete();
    });

    ReportModel.getTasksByStatus((err, data) => {
        if (err) {
            hasError = true;
            return res.status(500).json({
                error: 'Erro ao buscar tarefas por status',
                message: err.message
            });
        }

        tasksByStatus = data;
        checkComplete();
    });
};

module.exports = {
    getGeneralStats,
    getFullReport,
    getStatsForChart,
    getCSVData,
    getPDFData
};