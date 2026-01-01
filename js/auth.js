// Avtorizatsiya va sessiya boshqaruvi

document.addEventListener('DOMContentLoaded', function() {
    // Kirish sahifasi logikasi
    if (document.querySelector('.login-page')) {
        const roleCards = document.querySelectorAll('.role-card');
        const loginBtn = document.getElementById('loginBtn');
        const accessKeyInput = document.getElementById('accessKey');
        const branchSelect = document.getElementById('branchSelect');
        
        let selectedRole = 'admin';
        
        // Rol tanlash
        roleCards.forEach(card => {
            card.addEventListener('click', function() {
                roleCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                selectedRole = this.dataset.role;
                
                // Agar filial menejeri tanlangan bo'lsa, filial tanlashni ko'rsat
                branchSelect.parentElement.style.display = 
                    selectedRole === 'branch' ? 'block' : 'none';
            });
        });
        
        // Kirish tugmasi
        loginBtn.addEventListener('click', function() {
            const accessKey = accessKeyInput.value.trim();
            
            // Demo kalit: 123456
            if (accessKey === '123456') {
                // Saqlash localStorage'ga
                const userData = {
                    role: selectedRole,
                    branch: selectedRole === 'branch' ? branchSelect.value : null,
                    branchName: selectedRole === 'branch' ? 
                        branchSelect.options[branchSelect.selectedIndex].text : 'Markaz',
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('mbrs_user', JSON.stringify(userData));
                
                // Dashboardga yo'naltirish
                window.location.href = 'dashboard.html';
            } else {
                alert('Noto‘g‘ri kirish kaliti! Demo kalit: 123456');
            }
        });
        
        // Demo ma'lumotni avtomatik to'ldirish
        accessKeyInput.value = '123456';
    }
    
    // Boshqa sahifalarda foydalanuvchi ma'lumotlarini tekshirish
    if (!document.querySelector('.login-page') && !document.querySelector('.index.html')) {
        const userData = JSON.parse(localStorage.getItem('mbrs_user'));
        
        if (!userData) {
            // Avtorizatsiyadan o'tmagan bo'lsa, login sahifasiga qaytarish
            window.location.href = 'login.html';
            return;
        }
        
        // Foydalanuvchi ma'lumotlarini sahifaga joylash
        if (document.getElementById('currentUser')) {
            document.getElementById('currentUser').textContent = 
                userData.role === 'admin' ? 'Admin' : userData.branchName;
        }
        
        if (document.getElementById('currentRole')) {
            document.getElementById('currentRole').textContent = 
                userData.role === 'admin' ? 'Markaz Administrator' : 'Filial Menejeri';
        }
        
        // Chiqish tugmasi
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('mbrs_user');
                window.location.href = 'login.html';
            });
        }
        
        // Joriy sana
        if (document.getElementById('currentDate')) {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('currentDate').textContent = 
                now.toLocaleDateString('uz-UZ', options);
        }
    }
});