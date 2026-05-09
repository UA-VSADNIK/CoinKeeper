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

// 1. Отримуємо всі транзакції користувача
$sql = "SELECT * FROM transactions WHERE user_id = ?";

$params = [$user_id];
$types = "i";


// 2. Фільтри
// 2.1. Пошук по опису
if (!empty($_GET['search'])) {
    $sql .= " AND description LIKE ?";
    $params[] = "%" . $_GET['search'] . "%";
    $types .= "s";
}

// 2.2. Категорія
if (!empty($_GET['category'])) {
    $sql .= " AND category = ?";
    $params[] = $_GET['category'];
    $types .= "s";
}

// 2.3. Дата від
if (!empty($_GET['date_from'])) {
    $sql .= " AND transaction_date >= ?";
    $params[] = $_GET['date_from'];
    $types .= "s";
}

// 2.4. Дата до
if (!empty($_GET['date_to'])) {
    $sql .= " AND transaction_date <= ?";
    $params[] = $_GET['date_to'];
    $types .= "s";
}

// 2.5. Мінімальна сума
if (!empty($_GET['min_sum'])) {
    $sql .= " AND amount >= ?";
    $params[] = $_GET['min_sum'];
    $types .= "d";
}

// 2.6. Максимальна сума
if (!empty($_GET['max_sum'])) {
    $sql .= " AND amount <= ?";
    $params[] = $_GET['max_sum'];
    $types .= "d";
}


// 3. Сортування та підготовка
$sql .= " ORDER BY transaction_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$transactions = $stmt->get_result();


// 4. Кількість транзакцій та витрат
$transactionCount = $transactions->num_rows;
$expenseCount = 0;
while ($row = $transactions->fetch_assoc()) {
    if ($row['type'] === 'expense') {
        $expenseCount++;
    }
}

$transactions->data_seek(0);


// 5. Загальна сума витрат
$sqlTotal = "SELECT SUM(amount) as total
             FROM transactions
             WHERE user_id = ?
             AND type = 'expense'";

$stmtTotal = $conn->prepare($sqlTotal);
$stmtTotal->bind_param("i", $user_id);
$stmtTotal->execute();

$totalResult = $stmtTotal->get_result()->fetch_assoc();

$total = $totalResult['total'] ?? 0;

?>




<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>CoinKeeper - Мої витрати</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
    </style>
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
                <div class="nav-item active">Мої витрати</div>
                <div class="nav-item" onclick="location.href='../analytics/analytics.php'">Аналітика</div>
                <div class="nav-item">Сім'я</div>
                <div class="nav-item" onclick="location.href='../feedback/feedback.html'">Зворотний зв'язок</div>
                <div class="nav-item" onclick="location.href='../settings/settings.php'">Налаштування</div>
            </nav>
            <div class="logout" onclick="logoutUser()">Вийти</div>
        </aside>

        <main class="main-content">
            <h1 class="page-title">Мої витрати</h1>
            <div class="card summary-card-clean">
                <p>Загальна сума</p>
                <h1 id="total-expenses-sum"><?= number_format($total, 2, '.', '') ?> ₴</h1>
                <small id="transaction-count">
                    Кількість транзакцій: <?= $transactionCount ?>.<br>
                    Кількість витрат: <?= $expenseCount ?>.
                </small>
            </div>
            <div class="card filter-section">
                <div class="filter-header">
                    <h3>Фільтри</h3>
                </div>
                <form method="GET">
                    <div class="filter-grid-container">
                        <div class="input-group">
                            <label>Пошук</label>
                                <input type="text" id="filter-search" placeholder="Шукати за описом..." name="search" value="<?= $_GET['search'] ?? '' ?>">
                        </div>
                        <div class="input-group">
                            <label>Категорія</label>
                            <select id="filter-category" name="category">
                                <option value="">Всі категорії</option>
                                <option value="food"
                                    <?= ($_GET['category'] ?? '') == 'food' ? 'selected' : '' ?>>Їжа
                                </option>
                                <option value="transport"
                                    <?= ($_GET['category'] ?? '') == 'transport' ? 'selected' : '' ?>>Транспорт
                                </option>
                                <option value="housing"
                                    <?= ($_GET['category'] ?? '') == 'housing' ? 'selected' : '' ?>>Житло
                                </option>
                                <option value="entertainment"
                                    <?= ($_GET['category'] ?? '') == 'entertainment' ? 'selected' : '' ?>>Розваги
                                </option>
                                <option value="health"
                                    <?= ($_GET['category'] ?? '') == 'health' ? 'selected' : '' ?>>Здоров'я
                                </option>
                                <option value="other"
                                    <?= ($_GET['category'] ?? '') == 'other' ? 'selected' : '' ?>>Інше
                                </option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Дата від</label>
                            <input type="date" id="filter-date-from" name="date_from" value="<?= $_GET['date_from'] ?? '' ?>">
                        </div>
                        <div class="input-group">
                            <label>Дата до</label>
                            <input type="date" id="filter-date-to" name="date_to" value="<?= $_GET['date_to'] ?? '' ?>">
                        </div>
                        <div class="input-group">
                            <label>Мінімальна сума (₴)</label>
                            <input type="number" id="filter-sum-min" name="min_sum" value="<?= $_GET['min_sum'] ?? '' ?>">
                        </div>
                        <div class="input-group">
                            <label>Максимальна сума (₴)</label>
                            <input type="number" id="filter-sum-max" name="max_sum" value="<?= $_GET['max_sum'] ?? '' ?>">
                        </div>
                    </div>
                    <div class="filter-actions">
                        <button type="submit" class="btn-filter-action">Застосувати фільтри</button>
                        <a href="expenses.php" class="btn-filter-action">Скинути фільтри</a>
                    </div>
                </form>   
                <div class="card table-section">
                    <div class="table-header">
                        <h3 id="table-title">Витрати</h3>
                        <button id="show-all-btn" class="btn-action"
                            onclick="showAllTransactions()">Показати всі транзакції</button>
                        <button id="hide-all-btn" class="btn-action" style="display: none;"
                            onclick="hideIncomeTransactions()">Сховати поповнення</button>
                    </div>
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
                                <tr class="<?= $transaction['type'] ?>">
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
            </div>
        </main>
    </div>
<script src="../script.js"></script>
<script src="expenses.js"></script>

</body>
</html>