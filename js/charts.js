// Chart.js diagrammalari

document.addEventListener('DOMContentLoaded', function() {
    // Mini chart (dashboard)
    const miniCtx = document.getElementById('miniChart');
    if (miniCtx) {
        const dataManager = window.dataManager || new DataManager();
        const transactions = dataManager.getTransactions();
        
        // Oxirgi 7 kun uchun ma'lumotlar
        const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();
        
        const dailyIncome = last7Days.map(date => {
            return transactions
                .filter(t => t.date === date && t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
        });
        
        new Chart(miniCtx, {
            type: 'bar',
            data: {
                labels: last7Days.map(d => d.split('-')[2] + '/' + d.split('-')[1]),
                datasets: [{
                    label: 'Daromad (soʻm)',
                    data: dailyIncome,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgb(52, 152, 219)',
                    borderWidth: 1
                }]
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
                            callback: function(value) {
                                return value >= 1000000 ? 
                                    (value/1000000).toFixed(1) + 'M' : 
                                    value >= 1000 ? 
                                    (value/1000).toFixed(0) + 'K' : value;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Analytics sahifasi uchun katta diagrammalar
    if (document.querySelector('.analytics-page')) {
        loadAnalyticsCharts();
    }
});

function loadAnalyticsCharts() {
    const dataManager = window.dataManager || new DataManager();
    const transactions = dataManager.getTransactions();
    const branches = dataManager.getBranches();
    
    // 1. Filiallar bo'yicha daromad (Pie chart)
    const branchIncome = branches.map(branch => {
        return transactions
            .filter(t => t.branchId === branch.id && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    });
    
    const incomeCtx = document.getElementById('incomeByBranchChart');
    if (incomeCtx) {
        new Chart(incomeCtx, {
            type: 'pie',
            data: {
                labels: branches.map(b => b.name),
                datasets: [{
                    data: branchIncome,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    title: {
                        display: true,
                        text: 'Filiallar boʻyicha daromad ulushi'
                    }
                }
            }
        });
    }
    
    // 2. Vaqt bo'yicha daromad/xarajat (Line chart)
    const monthlyCtx = document.getElementById('monthlyTrendChart');
    if (monthlyCtx) {
        // Oxirgi 6 oy
        const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'];
        const monthlyIncome = [4500000, 5200000, 4800000, 6100000, 7500000, 6800000];
        const monthlyExpense = [3200000, 3400000, 3100000, 4200000, 4500000, 4100000];
        
        new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Daromad',
                        data: monthlyIncome,
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Xarajat',
                        data: monthlyExpense,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Oylik daromad va xarajat trendi'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return (value / 1000000).toFixed(1) + 'M soʻm';
                            }
                        }
                    }
                }
            }
        });
    }
}