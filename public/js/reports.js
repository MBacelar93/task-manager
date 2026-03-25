const API_REPORTS = '/api/reports';

let allTasks = [];
let chartInstances = {};

const elements = {
    loadingStats: document.getElementById('loadingStats'),
    statsContainer: document.getElementById('statsContainer'),
    totalTasks: document.getElementById('totalTasks'),
    completedTasks: document.getElementById('completedTasks'),
    pendingTasks: document.getElementById('pendingTasks'),
    percentageTasks: document.getElementById('percentageTasks'),
    pieChart: document.getElementById('pieChart'),
    barChart: document.getElementById('barChart'),
    downloadCSV: document.getElementById('downloadCSV'),
    downloadPDF: document.getElementById('downloadPDF'),
    downloadMessage: document.getElementById('downloadMessage'),
    loadingTasks: document.getElementById('loadingTasks'),
    tasksTableBody: document.getElementById('tasksTableBody'),
    filterButtons: document.querySelectorAll('.filter-btn')
};

async function getFullReport() {
    try {
        const response = await fetch(`${API_REPORTS}/full`);

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar relatório:', error);
        showMessage('Erro ao carregar relatório', 'error');
        return null;
    }
}

async function getChartData() {
    try {
        const response = await fetch(`${API_REPORTS}/chart`);

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        return null;
    }
}

function displayStats(stats) {
    elements.totalTasks.textContent = stats.total;
    elements.completedTasks.textContent = stats.completed;
    elements.pendingTasks.textContent = stats.pending;
    elements.percentageTasks.textContent = `${stats.percentage}%`;
    elements.loadingStats.style.display = 'none';
    elements.statsContainer.style.display = 'grid';
}

function createPieChart(chartData) {
    const ctx = elements.pieChart.getContext('2d');

    if (chartInstances.pie) {
        chartInstances.pie.destroy();
    }

    chartInstances.pie = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    data: chartData.datasets[0].data,
                    backgroundColor: chartData.datasets[0].backgroundColor,
                    borderColor: chartData.datasets[0].borderColor,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { size: 14 }
                    }
                }
            }
        }
    });
}

function createBarChart(chartData) {
    const ctx = elements.barChart.getContext('2d');

    if (chartInstances.bar) {
        chartInstances.bar.destroy();
    }

    chartInstances.bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: chartData.datasets[0].label,
                    data: chartData.datasets[0].data,
                    backgroundColor: chartData.datasets[0].backgroundColor,
                    borderColor: chartData.datasets[0].borderColor,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function displayTasksTable(tasks, filter = 'all') {
    elements.tasksTableBody.innerHTML = '';

    let filteredTasks = tasks;

    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed === 1);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => task.completed === 0);
    }

    if (filteredTasks.length === 0) {
        elements.tasksTableBody.innerHTML =
            '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhuma tarefa encontrada</td></tr>';
        return;
    }

    filteredTasks.forEach(task => {
        const row = document.createElement('tr');
        const status = task.completed === 1 ? 'Concluída' : 'Pendente';
        const statusClass = task.completed === 1 ? 'status-completed' : 'status-pending';
        const date = new Date(task.created_at);
        const formattedDate = date.toLocaleDateString('pt-BR');

        row.innerHTML = `
            <td>#${task.id}</td>
            <td><strong>${escapeHtml(task.title)}</strong></td>
            <td>${task.description ? escapeHtml(task.description) : '-'}</td>
            <td><span class="${statusClass}">${status}</span></td>
            <td>${formattedDate}</td>
        `;

        elements.tasksTableBody.appendChild(row);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showMessage(text, type = 'success') {
    elements.downloadMessage.textContent = text;
    elements.downloadMessage.className = `message show ${type}`;

    setTimeout(() => {
        elements.downloadMessage.classList.remove('show');
    }, 3000);
}

async function downloadCSV() {
    try {
        const response = await fetch(`${API_REPORTS}/csv`);

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio_tarefas.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

        showMessage('✅ Arquivo CSV baixado!', 'success');
    } catch (error) {
        console.error('Erro ao baixar CSV:', error);
        showMessage('Erro ao baixar CSV', 'error');
    }
}

async function downloadPDF() {
    try {
        const response = await fetch(`${API_REPORTS}/pdf`);

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();

        const element = document.createElement('div');

        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';

        element.innerHTML = `
            <h1 style="text-align: center; margin-bottom: 30px;">Relatório de Tarefas</h1>

            <h2 style="margin-top: 20px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Estatísticas Gerais</h2>
            <p><strong>Total de Tarefas:</strong> ${data.stats.total}</p>
            <p><strong>Tarefas Concluídas:</strong> ${data.stats.completed}</p>
            <p><strong>Tarefas Pendentes:</strong> ${data.stats.pending}</p>
            <p><strong>Taxa de Conclusão:</strong> ${data.stats.percentage}%</p>

            <h2 style="margin-top: 30px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Lista de Tarefas</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background-color: #ecf0f1;">
                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">ID</th>
                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Título</th>
                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.tasks.map(task => `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">#${task.id}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(task.title)}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${task.completed === 1 ? 'Concluída' : 'Pendente'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <p style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px;">
                Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            </p>
        `;

        const opt = {
            margin: 10,
            filename: 'relatorio_tarefas.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        html2pdf().set(opt).from(element).save();
        showMessage('✅ Arquivo PDF baixado!', 'success');
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        showMessage('Erro ao gerar PDF', 'error');
    }
}

elements.downloadCSV.addEventListener('click', downloadCSV);
elements.downloadPDF.addEventListener('click', downloadPDF);

elements.filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        elements.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const filter = e.target.getAttribute('data-filter');
        displayTasksTable(allTasks, filter);
    });
});

async function init() {
    console.log('Inicializando página de relatórios...');

    const report = await getFullReport();

    if (!report) {
        return;
    }

    displayStats(report.stats);

    allTasks = report.tasks || [];
    displayTasksTable(allTasks);

    const chartData = await getChartData();
    if (chartData) {
        createPieChart(chartData);
        createBarChart(chartData);
    }
}

document.addEventListener('DOMContentLoaded', init);