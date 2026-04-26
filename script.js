// --- КОНСТАНТИ ТА ІНІЦІАЛІЗАЦІЯ ---
const INITIAL_BALANCE = 15420.50;
const DEFAULT_LIMIT = 6000.00;

let currentTrendChart; // Глобальна змінна для графіка аналітики

if (!localStorage.getItem('expenses')) {
    localStorage.setItem('expenses', JSON.stringify([]));
}

function getExpenses() {
    return JSON.parse(localStorage.getItem('expenses'));
}

// --- НОВА ФУНКЦІЯ: ОТРИМАННЯ РЕАЛЬНИХ ДАНИХ ДЛЯ АНАЛІТИКИ ---
function getRealChartData(period = 'week') {
    const expenses = getExpenses().filter(e => e.type !== 'income');
    const now = new Date();
    const dateFromInput = document.getElementById('analytics-date-from')?.value;
    const dateToInput = document.getElementById('analytics-date-to')?.value;

    const filtered = expenses.filter(e => {
        const expDate = new Date(e.date);
        
        if (period === 'week') {
            const limit = new Date();
            limit.setDate(now.getDate() - 7);
            return expDate >= limit;
        } 
        else if (period === '3month') {
            const limit = new Date();
            limit.setMonth(now.getMonth() - 3);
            return expDate >= limit;
        } 
        else if (period === '6month') {
            const limit = new Date();
            limit.setMonth(now.getMonth() - 6);
            return expDate >= limit;
        } 
        else if (period === 'year') {
            const limit = new Date();
            limit.setFullYear(now.getFullYear() - 1);
            return expDate >= limit;
        } 
        else if (period === 'custom' && dateFromInput && dateToInput) {
            return e.date >= dateFromInput && e.date <= dateToInput;
        }
        return true; // За замовчуванням показуємо все
    });

    const categories = ['Їжа', 'Транспорт', 'Розваги', 'Здоров\'я', 'Інше'];
    return categories.map(cat => {
        return filtered
            .filter(e => e.category === cat)
            .reduce((sum, e) => sum + parseFloat(e.sum), 0);
    });
}

// --- НОВА ФУНКЦІЯ: ТОП КАТЕГОРІЙ ---
function updateTopCategories() {
    const expenses = getExpenses().filter(e => e.type !== 'income');
    const totals = {};
    
    expenses.forEach(e => {
        totals[e.category] = (totals[e.category] || 0) + parseFloat(e.sum);
    });

    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const topGrid = document.querySelector('.top-categories-grid');
    
    if (topGrid) {
        topGrid.innerHTML = sorted.slice(0, 3).map((item, index) => `
            <div class="top-chip ${index === 0 ? 'teal-light' : index === 1 ? 'orange-light' : 'rose-light'}">
                <div class="chip-num">#${index + 1}</div>
                <p>${item[0]}</p>
                <h2>${item[1].toFixed(2)} ₴</h2>
            </div>
        `).join('');
    }
}

// --- РОЗРАХУНОК ФІНАНСІВ ---
function updateFinancials() {
    const expenses = getExpenses();
    const currentMonth = new Date().getMonth();
    
    const totalSpentMonth = expenses
        .filter(e => new Date(e.date).getMonth() === currentMonth && e.type !== 'income')
        .reduce((sum, e) => sum + parseFloat(e.sum), 0);

    const totalIncome = expenses
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + parseFloat(e.sum), 0);
        
    const totalAllExpenses = expenses
        .filter(e => e.type !== 'income')
        .reduce((sum, e) => sum + parseFloat(e.sum), 0);

    const finalBalance = INITIAL_BALANCE + totalIncome - totalAllExpenses;

    const balanceEl = document.querySelector('.balance-card h1');
    const spentEl = document.querySelector('.limit-card h1');
    
    if (balanceEl) {
        balanceEl.innerText = `${finalBalance.toFixed(2)} ₴`;
        balanceEl.style.color = finalBalance < 0 ? '#ce6a6c' : '';
    }
    if (spentEl) spentEl.innerText = `${totalSpentMonth.toFixed(2)} ₴`;

    const totalSumEl = document.getElementById('total-expenses-sum');
    if (totalSumEl) totalSumEl.innerText = `${totalSpentMonth.toFixed(2)} ₴`;

    const countEl = document.getElementById('transaction-count');
    if (countEl) countEl.innerText = `Знайдено транзакцій: ${expenses.length}`;

    if (totalSpentMonth > DEFAULT_LIMIT) {
        const limitCard = document.querySelector('.limit-card');
        if (limitCard) limitCard.style.border = "2px solid red";
    }
}


function addTransaction() {
    const cat = document.getElementById('cat-select').value;
    const sumInput = document.getElementById('sum-input').value;
    const date = document.getElementById('date-input').value;
    const desc = document.getElementById('desc-input').value;

    const sum = parseFloat(sumInput);

    // 1. Базова перевірка заповнення
    if (!sum || sum <= 0 || cat === "Виберіть категорію") {
        alert("Заповніть коректно всі поля!");
        return;
    }

    // 2. Розрахунок поточного балансу перед додаванням
    const expenses = getExpenses();
    const totalIncome = expenses
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + parseFloat(e.sum), 0);
        
    const totalAllExpenses = expenses
        .filter(e => e.type !== 'income')
        .reduce((sum, e) => sum + parseFloat(e.sum), 0);

    const currentBalance = INITIAL_BALANCE + totalIncome - totalAllExpenses;

    // 3. ПЕРЕВІРКА: чи не перевищує витрата баланс
    if (sum > currentBalance) {
        alert(`Помилка! Сума витрати (${sum.toFixed(2)} ₴) перевищує ваш поточний баланс (${currentBalance.toFixed(2)} ₴). Операція неможлива.`);
        return; // Зупиняємо функцію, витрата не додається
    }

    // 4. Якщо все ок — додаємо транзакцію
    expenses.unshift({ 
        category: cat, 
        sum: sum, 
        date: date, 
        desc: desc, 
        type: 'expense', 
        id: Date.now() 
    });
    
    localStorage.setItem('expenses', JSON.stringify(expenses));
    location.reload();
}

// 1. Відкрити вікно
function topUpBalance() {
    const modal = document.getElementById('topup-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('modal-amount-input').focus();
    }
}

// 2. Закрити вікно
function closeTopUpModal() {
    document.getElementById('topup-modal').style.display = 'none';
    document.getElementById('modal-amount-input').value = '';
}

// 3. Підтвердити поповнення
function confirmTopUp() {
    const amountInput = document.getElementById('modal-amount-input');
    const amount = parseFloat(amountInput.value);

    if (amount && amount > 0) {
        const expenses = getExpenses();
        // Додаємо запис про поповнення
        expenses.unshift({ 
            category: 'Дохід', 
            sum: amount, 
            date: new Date().toISOString().split('T')[0], 
            desc: 'Поповнення через додаток', 
            type: 'income', 
            id: Date.now() 
        });
        
        localStorage.setItem('expenses', JSON.stringify(expenses));
        location.reload(); // Оновлюємо сторінку для перерахунку балансу
    } else {
        alert("Будь ласка, введіть коректну суму більше нуля!");
    }
}

// Додатково: закриття вікна при кліку на фон
window.addEventListener('click', (event) => {
    const modal = document.getElementById('topup-modal');
    if (event.target === modal) {
        closeTopUpModal();
    }
});
// --- ВИДАЛЕННЯ ---
function askDeleteConfirmation(index, event) {
    const container = event.target.closest('.action-cell-container');
    if (!container) return;
    container.innerHTML = `
        <div class="delete-confirm-row">
            <button class="btn-confirm-yes" onclick="confirmDelete(${index})">Так</button>
            <button class="btn-confirm-no" onclick="location.reload()">Ні</button>
        </div>`;
}

function confirmDelete(index) {
    let expenses = getExpenses();
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    location.reload(); 
}

// --- ТАБЛИЦІ ТА СИНХРОНІЗАЦІЯ ---
function renderTransactions(tableId, limit = null) {
    const tableBody = document.querySelector(`${tableId} tbody`);
    if (!tableBody) return;

    let expenses = getExpenses();
    if (limit) expenses = expenses.slice(0, limit);

    tableBody.innerHTML = '';

    if (expenses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Транзакцій ще немає</td></tr>';
        return;
    }

    expenses.forEach((item, index) => {
        const isIncome = item.type === 'income';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date.split('-').reverse().join('.')}</td>
            <td>${item.category}</td>
            <td>${item.desc || '-'}</td>
            <td class="text-right" style="color: ${isIncome ? '#2d8647' : '#ce6a6c'}; font-weight: bold;">
                ${isIncome ? '+' : '-'}${parseFloat(item.sum).toFixed(2)} ₴
            </td>
            <td class="text-center">
                <div class="action-cell-container">
                    <span class="delete-icon" onclick="askDeleteConfirmation(${index}, event)">🗑️</span>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
// Чекбокси категорій в аналітиці
document.querySelectorAll('.category-row-container input').forEach(input => {
    input.addEventListener('change', (e) => {
        if (currentTrendChart) {
            // Отримуємо номер категорії з data-idx
            const idx = e.target.getAttribute('data-idx'); 
            // Встановлюємо видимість (true/false)
            currentTrendChart.setDatasetVisibility(idx, e.target.checked);
            // Обов'язково оновлюємо графік, щоб побачити зміни
            currentTrendChart.update();
        }
    });
});
function getAnalyticsData(period = 'week') {
    const expenses = getExpenses().filter(e => e.type !== 'income');
    const now = new Date();
    const labels = [];
    const categoryData = {
        'Їжа': [], 'Транспорт': [], 'Розваги': [], 'Здоров\'я': [], 'Інше': []
    };

    if (period === 'week') {
        // ЛОГІКА ДЛЯ ТИЖНЯ (7 днів)
        const dayNames = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dayLabel = dayNames[d.getDay()];
            labels.push(dayLabel);

            // Фільтруємо витрати суто за цей конкретний день
            const dayExpenses = expenses.filter(e => {
                const expDate = new Date(e.date);
                return expDate.getDate() === d.getDate() && 
                       expDate.getMonth() === d.getMonth() && 
                       expDate.getFullYear() === d.getFullYear();
            });

            Object.keys(categoryData).forEach(cat => {
                const sum = dayExpenses
                    .filter(e => e.category === cat)
                    .reduce((s, e) => s + parseFloat(e.sum), 0);
                categoryData[cat].push(sum);
            });
        }
    } else {
        // ЛОГІКА ДЛЯ МІСЯЦІВ (3, 6, 12 міс)
        const monthNames = ["Січ", "Лют", "Бер", "Квіт", "Трав", "Черв", "Лип", "Серп", "Вер", "Жовт", "Лист", "Груд"];
        let monthsToDisplay = period === '3month' ? 3 : (period === '6month' ? 6 : 12);

        for (let i = monthsToDisplay - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            labels.push(monthNames[d.getMonth()]);

            const monthExpenses = expenses.filter(e => {
                const expDate = new Date(e.date);
                return expDate.getMonth() === d.getMonth() && expDate.getFullYear() === d.getFullYear();
            });

            Object.keys(categoryData).forEach(cat => {
                const sum = monthExpenses
                    .filter(e => e.category === cat)
                    .reduce((s, e) => s + parseFloat(e.sum), 0);
                categoryData[cat].push(sum);
            });
        }
    }

    return { labels, categoryData };
}

// --- ОНОВЛЕНА АНАЛІТИКА ---
function initTrendChart(type = 'bar', period = 'week') {
    const ctxTrend = document.getElementById('trendChart');
    if (!ctxTrend) return;
    if (currentTrendChart) currentTrendChart.destroy();

    const dataPackage = getAnalyticsData(period); // Викликаємо нову функцію

    currentTrendChart = new Chart(ctxTrend, {
        type: type,
        data: {
            labels: dataPackage.labels,
            datasets: [
                { label: 'Їжа', data: dataPackage.categoryData['Їжа'], backgroundColor: '#4c929e' },
                { label: 'Транспорт', data: dataPackage.categoryData['Транспорт'], backgroundColor: '#ce6a6c' },
                { label: 'Розваги', data: dataPackage.categoryData['Розваги'], backgroundColor: '#e9b3a3' },
                { label: 'Здоров\'я', data: dataPackage.categoryData['Здоров\'я'], backgroundColor: '#bed3c4' },
                { label: 'Інше', data: dataPackage.categoryData['Інше'], backgroundColor: '#222e54' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}


// --- ЗАПУСК ПРИ ЗАВАНТАЖЕННІ ---
document.addEventListener('DOMContentLoaded', () => {
    updateFinancials();
    renderTransactions('#trans-table', 5);
    renderTransactions('#full-trans-table');

    // Графік на дашборді
    const pieElem = document.getElementById('mainPieChart');
    if (pieElem) {
        const expenses = getExpenses().filter(e => e.type !== 'income');
        const dataMap = {};
        expenses.forEach(e => dataMap[e.category] = (dataMap[e.category] || 0) + parseFloat(e.sum));

        new Chart(pieElem, {
            type: 'pie',
            data: {
                labels: Object.keys(dataMap),
                datasets: [{
                    data: Object.values(dataMap),
                    backgroundColor: ['#4c929e', '#ce6a6c', '#e9b3a3', '#bed3c4','#222e54']
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }

    // Аналітика
    if (document.getElementById('trendChart')) {
        initTrendChart();
        updateTopCategories();
    }

    const periodSelector = document.getElementById('period-selector');
    const typeSelector = document.getElementById('type-selector');
if (periodSelector) {
    periodSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-tab')) {
            // Видаляємо active у всіх
            document.querySelectorAll('#period-selector .btn-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const period = e.target.dataset.period;
            const customPicker = document.getElementById('custom-date-picker');

            if (period === 'custom') {
                if (customPicker) customPicker.style.display = 'flex';
            } else {
                if (customPicker) customPicker.style.display = 'none';
                const currentType = document.querySelector('#type-selector .btn-toggle.active')?.dataset.type || 'bar';
                initTrendChart(currentType, period);
            }
        }
    });
}

    if (typeSelector) {
        typeSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-toggle')) {
                document.querySelectorAll('#type-selector .btn-toggle').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                initTrendChart(e.target.dataset.type, document.querySelector('.btn-tab.active').dataset.period);
            }
        });
    }
});
function applyCustomAnalytics() {
    const currentType = document.querySelector('#type-selector .btn-toggle.active')?.dataset.type || 'bar';
    initTrendChart(currentType, 'custom');
    updateTopCategories(); // Також оновимо ТОП-3 для цього періоду
}
// --- ІНШІ ФУНКЦІЇ (ФІЛЬТРИ ТА ВИХІД) ---
function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

function applyFilters() {
    const expenses = getExpenses();
    const searchQuery = document.getElementById('filter-search').value.toLowerCase().trim();
    const category = document.getElementById('filter-category').value;
    const dateFrom = document.getElementById('filter-date-from').value;
    const dateTo = document.getElementById('filter-date-to').value;
    const minInput = document.getElementById('filter-sum-min').value;
    const maxInput = document.getElementById('filter-sum-max').value;
    
    const sumMin = minInput !== "" ? parseFloat(minInput) : 0;
    const sumMax = maxInput !== "" ? parseFloat(maxInput) : Infinity;

    const filteredExpenses = expenses.filter(item => {
        const absSum = Math.abs(parseFloat(item.sum));
        const matchesSearch = (item.desc || "").toLowerCase().includes(searchQuery) || item.category.toLowerCase().includes(searchQuery);
        const matchesCategory = (category === 'all' || item.category === category);
        const matchesSum = absSum >= sumMin && absSum <= sumMax;
        const matchesDate = (!dateFrom || item.date >= dateFrom) && (!dateTo || item.date <= dateTo);
        return matchesSearch && matchesCategory && matchesSum && matchesDate;
    });

    renderFilteredTable(filteredExpenses);
    if (document.getElementById('transaction-count')) document.getElementById('transaction-count').innerText = `Знайдено транзакцій: ${filteredExpenses.length}`;
}

function renderFilteredTable(data) {
    const tableBody = document.querySelector('#full-trans-table tbody');
    if (!tableBody) return;
    tableBody.innerHTML = data.length === 0 ? '<tr><td colspan="5" style="text-align:center;">Нічого не знайдено</td></tr>' : '';
    data.forEach((item, index) => {
        const isIncome = item.type === 'income';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date.split('-').reverse().join('.')}</td>
            <td>${item.category}</td>
            <td>${item.desc || '-'}</td>
            <td class="text-right" style="color: ${isIncome ? '#2d8647' : '#ce6a6c'}; font-weight: bold;">
                ${isIncome ? '+' : '-'}${parseFloat(item.sum).toFixed(2)} ₴
            </td>
            <td class="text-center"><div class="action-cell-container"><span class="delete-icon" onclick="askDeleteConfirmation(${index}, event)">🗑️</span></div></td>
        `;
        tableBody.appendChild(row);
    });
}

function resetFilters() {
    document.getElementById('filter-search').value = '';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
    document.getElementById('filter-sum-min').value = '';
    document.getElementById('filter-sum-max').value = '';
    renderTransactions('#full-trans-table');
}


// Перемикання між Входом та Реєстрацією
function toggleAuth() {
    document.getElementById('loginForm').classList.toggle('hidden')
    document.getElementById('registerForm').classList.toggle('hidden');
}

// Тимчасова функція входу без перевірки
function fakeLogin() {
    window.location.href = 'index.html'; 
}