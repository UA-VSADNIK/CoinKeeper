<?php
// 1. Категорії транзакцій
$categories = [
    // 1.1. Витрати
    'food' => [
        'name' => "Їжа",
        'color' => "#FF9800"
    ],
    'transport' => [
        'name' => "Транспорт",
        'color' => "#2196F3"
    ],
    'housing' => [
        'name' => "Житло",
        'color' => "#795548"
    ],
    'entertainment' => [
        'name' => "Розваги",
        'color' => "#9C27B0"
    ],
    'health' => [
        'name' => "Здоров'я",
        'color' => "#E91E63"
    ],
    'other' => [
        'name' => "Інше",
        'color' => "#607D8B"
    ],
    // 1.2. Дохід
    'income' => [
        'name' => "Дохід",
        'color' => "#4CAF50"
    ],
];
?>


<?php
session_start();

require '../db.php';
require '../auth/auth_check.php';

$user_id = $_SESSION['user_id'];

// Дані для аналітики
$sql = "SELECT
            DATE(transaction_date) as d,
            category,
            SUM(amount) as total
        FROM transactions
        WHERE user_id = ?
          AND type = 'expense'
        GROUP BY DATE(transaction_date), category
        ORDER BY d ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();


// Масив для JS
$analyticsData = [];

while ($row = $result->fetch_assoc()) {

    $analyticsData[] = [
        'd' => $row['d'],
        'category' => $row['category'],
        'total' => (float)$row['total']
    ];
}


?>



<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>CoinKeeper - Аналітика</title>
    <link rel="stylesheet" href="../style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="app-wrapper">
        <aside class="sidebar">
            <div class="logo">
                <img src="../CoinKeeper1.png" alt="CoinKeeper Logo" class="logo-img">
                <span>CoinKeeper</span>
            </div>
            <nav>
                <div class="nav-item" onclick="location.href='../main/index.php'">Головна</div>
                <div class="nav-item" onclick="location.href='../expenses/expenses.php'">Мої витрати</div>
                <div class="nav-item active" >Аналітика</div>
                <div class="nav-item">Сім'я</div>
                <div class="nav-item" onclick="location.href='../feedback/feedback.html'">Зворотний зв'язок</div>
                <div class="nav-item" onclick="location.href='../settings/settings.php'">Налаштування</div>
            </nav>
            <div class="logout" onclick="logoutUser()">Вийти</div>
        </aside>

        <main class="main-content">
            <h1>Аналітика</h1>
            <div class="card analytics-header">
                <h3>Період аналізу</h3>
                <div class="analytics-controls">
                    <div class="period-btn-group" id="period-selector">
                        <button class="btn-tab active" data-period="week">1 Тиждень</button>
                        <button class="btn-tab" data-period="month">1 міс</button>
                        <button class="btn-tab" data-period="3months">3 міс</button>
                        <button class="btn-tab" data-period="year">1 рік</button>
                    </div>
                    <div class="chart-toggle-group" id="type-selector">
                        <button class="btn-toggle active" data-type="bar">Стовпці</button>
                        <button class="btn-toggle" data-type="line">Лінії</button>
                    </div>
                </div>
            </div>

            <div class="card category-filter-card">
                <h3>Фільтр категорій</h3>
                <div class="category-row-container">
                    <div class="chip teal">
                        <input type="checkbox" checked data-category="food">Їжа
                    </div>
                    <div class="chip rose">
                        <input type="checkbox" checked data-category="transport">Транспорт
                    </div>
                    <div class="chip orange">
                        <input type="checkbox" checked data-category="housing">Житло
                    </div>
                    <div class="chip green">
                        <input type="checkbox" checked data-category="entertainment">Розваги
                    </div>
                    <div class="chip dark">
                        <input type="checkbox" checked data-category="health"> Здоров'я
                    </div>
                    <div class="chip">
                        <input type="checkbox" checked data-category="other"> Інше
                    </div>
                </div>
            </div>

            <div class="card chart-main-card">
                <h3>Тренд витрат</h3>
                <div class="chart-container-big">
                    <canvas id="trendChart"></canvas>
                </div>
            </div>
        </main>
    </div>
    <script>
        // Категорії
        window.categories = <?= json_encode($categories) ?>;

        // Дані аналітики з БД
        window.analyticsData = <?= json_encode($analyticsData) ?>;
    </script>
    <script src="analytics.js"></script>
    <script src="../script.js"></script>
</body>
</html>