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


// 1. Баланс
$sql_balance = "SELECT 
    SUM(CASE WHEN type='income' THEN amount ELSE 0 END) -
    SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS balance
    FROM transactions WHERE user_id = ?";

$stmt = $conn->prepare($sql_balance);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();

$balance = $res['balance'] ?? 0;


// 2. Витрати за місяць
$sql_month = "SELECT SUM(amount) as total FROM transactions
              WHERE user_id = ? AND type='expense'
              AND YEAR(transaction_date) = YEAR(CURDATE())
              AND MONTH(transaction_date) = MONTH(CURDATE())";

$stmt = $conn->prepare($sql_month);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();

$month_expense = $res['total'] ?? 0;


// 3. Останні транзакції
$sql = "SELECT * FROM transactions
        WHERE user_id = ?
        ORDER BY transaction_date DESC
        LIMIT 5";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$transactions = $stmt->get_result();


// 4. Дані для pie-витрат
$sql_chart = "SELECT category, SUM(amount) as total
              FROM transactions
              WHERE user_id = ? AND type = 'expense'
              GROUP BY category";

$stmt = $conn->prepare($sql_chart);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$chart_labels = [];
$chart_data = [];
$chart_colors = [];

while ($chartRow = $result->fetch_assoc()) {
    // Українська назва
    $chart_labels[] = $categories[$chartRow['category']]['name'] ?? $chartRow['category'];
    // Сума
    $chart_data[] = (float)$chartRow['total'];
    // Колір
    $chart_colors[] = $categories[$chartRow['category']]['color'] ?? '#999999';
}


// 4. Отримання бюджету на головній сторінці
$sqlBudget = "SELECT * FROM budgets WHERE user_id = ?
              ORDER BY budget_id DESC 
              LIMIT 1";

$stmt = $conn->prepare($sqlBudget);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$budgetResult = $stmt->get_result();
$currentBudget = $budgetResult->fetch_assoc();


// 5. Розрахунок прогресу
$budgetLimit = $currentBudget['limit_amount'] ?? 0;
$progressPercent = 0;

if ($budgetLimit > 0) {
    $progressPercent = min(100, ($month_expense / $budgetLimit) * 100);
}
?>




<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>CoinKeeper - Головна</title>
    <link rel="stylesheet" href="../style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="app-wrapper">
        <!-- ================= SIDEBAR ================= -->
        <aside class="sidebar">
            <div class="logo">
                <img src="../CoinKeeper1.png" alt="CoinKeeper Logo" class="logo-img">
                <span>CoinKeeper</span>
            </div>
            <nav>
                <div class="nav-item active">Головна</div>
                <div class="nav-item" onclick="location.href='../expenses/expenses.php'">Мої витрати</div>
                <div class="nav-item" onclick="location.href='../analytics/analytics.php'">Аналітика</div>
                <div class="nav-item">Сім'я</div>
                <div class="nav-item" onclick="location.href='../feedback/feedback.html'">Зворотний зв'язок</div>
                <div class="nav-item" onclick="location.href='../settings/settings.php'">Налаштування</div>
            </nav>
            <div class="logout" onclick="logoutUser()">Вийти</div>
        </aside>
        
         <!-- ================= MAIN ================= -->
        <main class="main-content">
            <div class="top-row">
                <div class="card balance-card">
                    <p>Загальний баланс</p>
                    <h1><?= number_format($balance, 2, '.', '') ?> ₴</h1>
                    <button class="btn-action btn-large" onclick="topUpBalance()">+ Поповнити баланс</button>
                </div>
                <div class="card limit-card">
                    <div class="limit-header">
                        <p>Витрачено за місяць</p>
                        <span class="limit-val"><?= round($progressPercent) ?>%</span>
                    </div>
                    <h1><?= number_format($month_expense, 2, '.', '') ?> ₴</h1>
                    <p class="limit-info">Ліміт: <?= number_format($budgetLimit, 2, '.', '') ?> ₴</p>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: <?= $progressPercent ?>%"></div>
                    </div>
                    <!-- НОВА КНОПКА -->
                    <button class="btn-action btn-large" style="margin-top: 15px;" 
                    onclick="openLimitModal()">+ Встановити ліміт</button>
                </div>
            </div>
            
            <!-- FORM + CHART -->
            <div class="middle-row">
                <div class="card form-section">
                    <h3>Швидке додавання витрати</h3>
                    <div class="input-group">
                        <label>Категорія</label>
                        <select id="cat-select">
                            <option value="">Виберіть категорію</option>
                            <option value="food">Їжа</option>
                            <option value="transport">Транспорт</option>
                            <option value="housing">Житло</option>
                            <option value="entertainment">Розваги</option>
                            <option value="health">Здоров'я</option>
                            <option value="other">Інше</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Сума (₴)</label>
                        <input type="number" id="sum-input" placeholder="0.00">
                    </div>
                    <div class="input-group">
                        <label>Дата</label>
                        <input type="date" id="date-input" value="<?= date('Y-m-d') ?>">
                    </div>
                    <div class="input-group">
                        <label>Опис</label>
                        <input type="text" id="desc-input" placeholder="Наприклад: Обід у ресторані">
                    </div>
                    <button class="btn-submit" onclick="addTransaction()">+ Додати</button>
                </div>

                <div class="card chart-section">
                    <h3>Розподіл витрат за категоріями</h3>
                    <div class="chart-wrapper">
                        <canvas id="mainPieChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="card table-section">
                <h3>Останні транзакції</h3>
                <table id="trans-table">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Категорія</th>
                            <th>Опис</th>
                            <th class="text-right">Сума</th>
                            <th class="text-center">Дія</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Додав таблицю -->
                        <?php while($transaction = $transactions->fetch_assoc()): ?>
                            <tr>
                                <td><?= date("d.m.Y", strtotime($transaction['transaction_date'])) ?></td>
                                <td><?= $categories[$transaction['category']]['name'] ?? $transaction['category'] ?></td>
                                <td><?= $transaction['description'] ?? '-' ?></td>
                    
                                <td class="text-right" style="color: <?= $transaction['type'] == 'income'
                                    ? $categories['income']['color'] : '#ce6a6c'; ?>">

                                    <?= $transaction['type']=='income' ? '+' : '-' ?>
                                    <?= number_format($transaction['amount'], 2, '.', '') ?> ₴
                                </td>
                                <td class="text-center">
                                    <button onclick="deleteTransaction(<?= $transaction['transaction_id'] ?>)">🗑️</button>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
<script>
    const chartLabels = <?= json_encode($chart_labels) ?>;
    const chartData = <?= json_encode($chart_data) ?>;
    const chartColors = <?= json_encode($chart_colors) ?>;

    if (chartData.length === 0) {
        console.log("Немає даних для графіка");
    }

    document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById('mainPieChart');
    
        if (ctx && chartLabels.length > 0) {
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        data: chartData,
                        backgroundColor: chartColors
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    });
</script>
<script src="../script.js"></script>
<script src="index.js"></script>


    <!-- Форма поповнення балансу -->
    <div id="topup-modal" class="modal-overlay">
    <div class="modal-card">
        <div class="modal-header">
            <h3>Поповнення балансу</h3>
            <span class="close-modal" onclick="closeTopUpModal()">&times;</span>
        </div>
        <div class="modal-body">
                    <p>Введіть суму, на яку хочете поповнити рахунок:</p>
                    <div class="input-group">
                        <input type="number" id="modal-amount-input" placeholder="0.00" step="0.01">
                    </div>
                <button class="btn-submit" style="margin-top: 10px;" onclick="confirmTopUp()">Підтвердити поповнення</button>
            </div>
        </div>
    </div>


<!-- Форма встановлення ліміту -->
    <div id="limit-modal" class="modal-overlay">
        <div class="modal-card">
            <div class="modal-header">
                <h3>Встановлення ліміту</h3>
                <span class="close-modal" onclick="closeLimitModal()">&times;</span>
            </div>
            <div class="modal-body">
                <p>Введіть суму ліміту:</p>
                <div class="input-group">
                <input type="number" id="limit-amount-input" placeholder="0.00" step="0.01">
                </div>
                <p style="margin-top: 15px;">Оберіть період:</p>
                <div class="input-group">
                    <select id="limit-period-select">
                        <option value="week">1 тиждень</option>
                        <option value="month" selected>1 місяць</option>
                        <option value="3months">3 місяці</option>
                        <option value="year">1 рік</option>
                    </select>
                </div>
                <button class="btn-submit" style="margin-top: 15px;" onclick="confirmLimit()">Встановити ліміт</button>
            </div>
        </div>
    </div>
</body>
</html>
