// Ma'lumotlar bazasi simulyatsiyasi (aslida LocalStorage ishlatiladi)

class DataManager {
    constructor() {
        this.STORAGE_KEY = 'mbrs_data';
        this.initSampleData();
    }
    
    // Namuna ma'lumotlarni yaratish (birinchi marta ishga tushganda)
    initSampleData() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const sampleData = {
                branches: [
                    {
                        id: 1,
                        name: "Toshkent Filiali",
                        address: "Chilonzor tumani",
                        manager: "Ali Valiyev",
                        phone: "+998901234567",
                        email: "tashkent@biznes.uz",
                        established: "2022-01-15",
                        status: "active"
                    },
                    {
                        id: 2,
                        name: "Samarqand Filiali",
                        address: "Registon ko'chasi",
                        manager: "Sardor Samiyev",
                        phone: "+998902345678",
                        email: "samarkand@biznes.uz",
                        established: "2022-03-22",
                        status: "active"
                    },
                    {
                        id: 3,
                        name: "Buxoro Filiali",
                        address: "Labi Hovuz",
                        manager: "Javlon Karimov",
                        phone: "+998903456789",
                        email: "bukhara@biznes.uz",
                        established: "2022-05-10",
                        status: "active"
                    },
                    {
                        id: 4,
                        name: "Andijon Filiali",
                        address: "Markaziy bozor",
                        manager: "Farrux Abdullayev",
                        phone: "+998904567890",
                        email: "andijan@biznes.uz",
                        established: "2022-07-18",
                        status: "inactive"
                    },
                    {
                        id: 5,
                        name: "Namangan Filiali",
                        address: "Chorsu maydoni",
                        manager: "Shoxrux Qodirov",
                        phone: "+998905678901",
                        email: "namangan@biznes.uz",
                        established: "2022-09-05",
                        status: "active"
                    }
                ],
                transactions: [
                    { id: 1, branchId: 1, type: 'income', amount: 12500000, description: 'Mahsulot sotuvi', date: '2023-11-01' },
                    { id: 2, branchId: 1, type: 'expense', amount: 4500000, description: 'Ofis ijara', date: '2023-11-01' },
                    { id: 3, branchId: 2, type: 'income', amount: 9800000, description: 'Xizmat ko\'rsatish', date: '2023-11-01' },
                    { id: 4, branchId: 2, type: 'expense', amount: 3200000, description: 'Xodimlar maoshi', date: '2023-11-02' },
                    { id: 5, branchId: 3, type: 'income', amount: 7600000, description: 'Kontrakt', date: '2023-11-02' },
                    { id: 6, branchId: 3, type: 'expense', amount: 2100000, description: 'Kommunal to\'lovlar', date: '2023-11-03' },
                    { id: 7, branchId: 1, type: 'income', amount: 15300000, description: 'Yirik loyiha', date: '2023-11-03' },
                    { id: 8, branchId: 1, type: 'expense', amount: 5200000, description: 'Reklama', date: '2023-11-04' },
                    { id: 9, branchId: 2, type: 'income', amount: 11200000, description: 'Mahsulot sotuvi', date: '2023-11-05' },
                    { id: 10, branchId: 3, type: 'expense', amount: 1800000, description: 'Transport', date: '2023-11-05' }
                ],
                reports: [],
                lastId: {
                    branches: 5,
                    transactions: 10,
                    reports: 0
                }
            };
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleData));
        }
    }
    
    // Barcha ma'lumotlarni olish
    getAllData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    }
    
    // Ma'lumotlarni yangilash
    updateData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    
    // Filiallarni olish
    getBranches() {
        const data = this.getAllData();
        return data.branches;
    }
    
    // Yangi filial qo'shish
    addBranch(branch) {
        const data = this.getAllData();
        data.lastId.branches += 1;
        branch.id = data.lastId.branches;
        branch.established = new Date().toISOString().split('T')[0];
        data.branches.push(branch);
        this.updateData(data);
        return branch;
    }
    
    // Tranzaksiyalarni olish
    getTransactions(branchId = null) {
        const data = this.getAllData();
        if (branchId) {
            return data.transactions.filter(t => t.branchId == branchId);
        }
        return data.transactions;
    }
    
    // Yangi tranzaksiya qo'shish
    addTransaction(transaction) {
        const data = this.getAllData();
        data.lastId.transactions += 1;
        transaction.id = data.lastId.transactions;
        transaction.date = new Date().toISOString().split('T')[0];
        data.transactions.push(transaction);
        this.updateData(data);
        return transaction;
    }
    
    // Hisobotlar generatsiyasi
    generateReport(type = 'daily') {
        const transactions = this.getTransactions();
        const branches = this.getBranches();
        const now = new Date();
        let report = {
            id: Date.now(),
            type: type,
            generated: now.toISOString(),
            data: {}
        };
        
        // Hisobotni generatsiya qilish logikasi
        if (type === 'daily') {
            const today = now.toISOString().split('T')[0];
            const todayTransactions = transactions.filter(t => t.date === today);
            
            report.data = {
                totalIncome: todayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
                totalExpense: todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
                transactionCount: todayTransactions.length,
                branchesInvolved: [...new Set(todayTransactions.map(t => t.branchId))].length
            };
        }
        
        return report;
    }
    
    // Statistika hisoblash
    calculateStats() {
        const transactions = this.getTransactions();
        const branches = this.getBranches();
        
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalProfit = totalIncome - totalExpense;
        const activeBranches = branches.filter(b => b.status === 'active').length;
        
        return {
            totalIncome,
            totalExpense,
            totalProfit,
            profitMargin: totalIncome > 0 ? (totalProfit / totalIncome * 100) : 0,
            activeBranches,
            totalBranches: branches.length
        };
    }
    
    // So'nggi faoliyatlar
    getRecentActivity(limit = 5) {
        const transactions = this.getTransactions();
        const branches = this.getBranches();
        
        return transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit)
            .map(t => {
                const branch = branches.find(b => b.id === t.branchId);
                return {
                    branch: branch ? branch.name : 'Noma\'lum',
                    type: t.type === 'income' ? 'Daromad' : 'Xarajat',
                    amount: t.amount.toLocaleString('uz-UZ') + ' so\'m',
                    description: t.description,
                    date: t.date
                };
            });
    }
}

// Global DataManager instansiyasi
const dataManager = new DataManager();

// Dashboard sahifasida ma'lumotlarni yuklash
if (document.querySelector('.dashboard')) {
    document.addEventListener('DOMContentLoaded', function() {
        const stats = dataManager.calculateStats();
        
        // Statistika kartalarini to'ldirish
        if (document.getElementById('totalIncome')) {
            document.getElementById('totalIncome').textContent = 
                stats.totalIncome.toLocaleString('uz-UZ') + ' so\'m';
        }
        
        if (document.getElementById('totalExpense')) {
            document.getElementById('totalExpense').textContent = 
                stats.totalExpense.toLocaleString('uz-UZ') + ' so\'m';
        }
        
        if (document.getElementById('totalProfit')) {
            document.getElementById('totalProfit').textContent = 
                stats.totalProfit.toLocaleString('uz-UZ') + ' so\'m';
        }
        
        if (document.getElementById('totalBranches')) {
            document.getElementById('totalBranches').textContent = 
                `${stats.activeBranches} ta`;
        }
        
        // So'nggi faoliyatlar
        const activityList = document.getElementById('recentActivity');
        if (activityList) {
            const activities = dataManager.getRecentActivity(3);
            activityList.innerHTML = '';
            
            activities.forEach(activity => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <i class="fas fa-${activity.type === 'Daromad' ? 'plus-circle text-success' : 'minus-circle text-danger'}"></i>
                    <div>
                        <strong>${activity.branch}</strong>: ${activity.description}
                        <div class="text-muted">${activity.amount} • ${activity.date}</div>
                    </div>
                `;
                activityList.appendChild(li);
            });
        }
        
        // Kunlik hisobot generatsiyasi funktsiyasi
        window.generateDailyReport = function() {
            const report = dataManager.generateReport('daily');
            alert(`Kunlik hisobot yaratildi!\n\nDaromad: ${report.data.totalIncome.toLocaleString()} so'm\nXarajat: ${report.data.totalExpense.toLocaleString()} so'm\nTranzaksiyalar: ${report.data.transactionCount} ta`);
            
            // Report sahifasiga yo'naltirish
            window.location.href = 'reports.html';
        };
    });
}