// Asosiy JavaScript fayli - umumiy funksiyalar

document.addEventListener('DOMContentLoaded', function() {
    // Mobil menyuni boshqarish
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
    }
    
    // Modal oynalarni boshqarish
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };
    
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    // Modal oynalar yopish
    document.querySelectorAll('.modal .close, .modal-overlay').forEach(el => {
        el.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Formani yuborishni oldini olish (demo)
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Demo xabar
            const formName = this.getAttribute('data-form-name') || 'Forma';
            alert(`${formName} ma'lumotlari saqlandi (demo rejim)`);
            
            // Dashboardga qaytish (agar kerak bo'lsa)
            if (this.classList.contains('redirect-to-dashboard')) {
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
            
            return false;
        });
    });
    
    // Export funktsiyalari
    window.exportToExcel = function() {
        alert('Excel formatida eksport qilish (backend bilan ishlaydi)');
        // Haqiqiy loyihada bu yerda serverga so'rov yuboriladi
    };
    
    window.exportToPDF = function() {
        alert('PDF hisobot yaratish (backend bilan ishlaydi)');
        // Haqiqiy loyihada bu yerda serverga so'rov yuboriladi
    };
    
    // Tizim ma'lumotlarni yangilash
    window.refreshData = function() {
        // LocalStorage'dan yangi ma'lumotlarni olish
        location.reload();
    };
});