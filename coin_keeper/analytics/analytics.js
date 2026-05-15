// 1. ГЛОБАЛЬНІ ЗМІННІ
// 1.1. Поточний графік (щоб можна було його оновлювати)
let currentTrendChart = null;
// 1.2. Поточний тип графіка
let currentChartType = 'bar';
// 1.3. Поточний період
let currentPeriod = 'week';


// 2. СЛОВНИКИ З ДАНИМИ
// 2.1. Конфігурація періодів
// Примітка: тут дуже легко додавати нові періоди

const periodConfig = {
    week: {
        label: '1 тиждень',
        days: 7
    },
    month: {
        label: '1 місяць',
        months: 1
    },
    '3months': {
        label: '3 місяці',
        months: 3
    },
    year: {
        label: '1 рік',
        months: 12
    }
};

// 2.3. Кольори категорій
// Примітка: можна змінити кольори
const categoryColors = {
    food: '#5b6b8f',
    transport: '#4c929e',
    housing: '#e9b3a3',
    entertainment: '#ce6a6c',
    health: '#bed3c4',
    other: '#222e54'
};

// 2.4. Українські назви для категорій
const categoryNames = {
    food: 'Їжа',
    transport: 'Транспорт',
    housing: 'Житло',
    entertainment: 'Розваги',
    health: "Здоров'я",
    other: 'Інше'
};


// 3. Отримання даних з php
function getPreparedChartData(period = 'week') {
    const rawData = window.analyticsData;

    const labels = [];
    const datasetsMap = {};

    // 3.1. Створюємо масиви для кожної категорії
    Object.keys(categoryNames).forEach(category => {

        datasetsMap[category] = {
            label: categoryNames[category],
            data: [],
            borderColor: categoryColors[category],
            backgroundColor: categoryColors[category],
            tension: 0.3
        };
    });

    // ТИЖДЕНЬ
    if (period === 'week') {
        const dayNames = [
            'Нд', 'Пн', 'Вт',
            'Ср', 'Чт', 'Пт', 'Сб'
        ];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const dayLabel = dayNames[date.getDay()];
            labels.push(dayLabel);

            // Формат YYYY-MM-DD
            const dateKey = date.toISOString().split('T')[0];

            // Шукаємо записи за цей день
            Object.keys(categoryNames).forEach(category => {
                const found = rawData.find(item =>
                    item.d === dateKey &&
                    item.category === category
                );

                datasetsMap[category].data.push(
                    found ? Number(found.total) : 0
                );
            });
        }
    }

    // МІСЯЦІ (1, 3, 12)
    else {
        const monthNames = [
            'Січень', 'Лютий', 'Березень',
            'Квітень', 'Травень', 'Червень',
            'Липень', 'Серпень', 'Вересень',
            'Жовтень', 'Листопад', 'Грудень'
        ];
        const monthsToShow = periodConfig[period].months;

        for (let i = monthsToShow - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);

            const month = date.getMonth();
            const year = date.getFullYear();

            labels.push(monthNames[month]);

            Object.keys(categoryNames).forEach(category => {

                // Сума витрат за місяць
                const sum = rawData
                    .filter(item => {
                        const itemDate = new Date(item.d);

                        return (
                            itemDate.getMonth() === month &&
                            itemDate.getFullYear() === year &&
                            item.category === category
                        );
                    })
                    .reduce((total, item) => {
                        return total + Number(item.total);
                    }, 0);
                datasetsMap[category].data.push(sum);
            });
        }
    }
    // Повертаємо labels + datasets
    return {
        labels,
        datasets: Object.values(datasetsMap)
    };
}


// 4. СТВОРЕННЯ ГРАФІКА
function renderTrendChart(period = 'week') {
    const ctx = document.getElementById('trendChart');

    // Видаляємо старий графік
    if (currentTrendChart) {
        currentTrendChart.destroy();
    }

    // Отримуємо підготовлені дані
    const chartData = getPreparedChartData(period);

    // Створюємо новий графік
    currentTrendChart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
            ...dataset,
            // Фіксована ширина стовпців
            categoryPercentage: 0.7,
            barPercentage: 0.8,
            // Максимальна ширина
            maxBarThickness: 50
            }))
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    // Після створення графіка оновлюємо видимість категорій
    updateCategoryVisibility();
}


// 5. ПЕРЕМИКАННЯ ПЕРІОДІВ
document.querySelectorAll('.btn-tab').forEach(button => {
    button.addEventListener('click', () => {
        // Знімаємо active
        document.querySelectorAll('.btn-tab').forEach(btn => btn.classList.remove('active'));
        // Додаємо active
        button.classList.add('active');
        // Новий період
        currentPeriod = button.dataset.period;
        // Перемальовуємо графік
        renderTrendChart(currentPeriod);
    });
});


// 6. ПЕРЕМИКАННЯ ТИПУ ГРАФІКА
document.querySelectorAll('.btn-toggle').forEach(button => {
    button.addEventListener('click', () => {
        // Active кнопка
        document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
        // Додаємо active
        button.classList.add('active');
        // Тип графіка
        currentChartType = button.dataset.type;
        // Знову створюємо
        renderTrendChart(currentPeriod);
    });
});


// 7. ФІЛЬТРАЦІЯ КАТЕГОРІЙ
document.querySelectorAll(
    '.category-row-container input'
).forEach(input => {
    input.addEventListener('change', () => {
        updateCategoryVisibility();
    });
});


// 8. ОНОВЛЕННЯ ВИДИМОСТІ
function updateCategoryVisibility() {
    if (!currentTrendChart) return;
    document.querySelectorAll(
        '.category-row-container input'
    ).forEach((checkbox, index) => {
        currentTrendChart.setDatasetVisibility(index, checkbox.checked);
    });
    currentTrendChart.update();
}


// 9. ЗАПУСК ПІСЛЯ ЗАВАНТАЖЕННЯ
document.addEventListener('DOMContentLoaded', () => {
    renderTrendChart('week');
});