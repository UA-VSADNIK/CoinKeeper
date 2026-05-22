<?php
session_start();
require '../db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: ../auth/login.html");
    exit();
}

$user_id = $_SESSION['user_id'];

// Отримуємо дані користувача
$sql_user = "SELECT name, email FROM users WHERE user_id = ?";
$stmt = $conn->prepare($sql_user);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();


// Отримуємо налаштування (валюта)
$sql_settings = "SELECT currency FROM settings WHERE user_id = ?";
$stmt = $conn->prepare($sql_settings);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$settings = $stmt->get_result()->fetch_assoc();


// Отримуємо бюджет
$sql_budget = "SELECT limit_amount 
               FROM budgets 
               WHERE user_id = ? 
               ORDER BY period_end DESC 
               LIMIT 1";

$stmt = $conn->prepare($sql_budget);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$budget = $stmt->get_result()->fetch_assoc();

$limit = $budget['limit_amount'] ?? 0;
?>



<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>CoinKeeper - Налаштування</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="app-wrapper">
        <aside class="sidebar">
            <a href="../main/index.php" class="logo-link">
                <div class="logo">
                    <img src="../CoinKeeper1.png" alt="CoinKeeper Logo" class="logo-img">
                    <span>CoinKeeper</span>
            </div>
            </a>
            <nav>
                <div class="nav-item" onclick="location.href='../main/index.php'">Головна</div>
                <div class="nav-item" onclick="location.href='../expenses/expenses.php'">Мої витрати</div>
                <div class="nav-item" onclick="location.href='../analytics/analytics.php'">Аналітика</div>
                <div class="nav-item" onclick="location.href='../additional/family.html'">Сім'я</div>
                <div class="nav-item" onclick="location.href='../feedback/feedback.html'">Зворотний зв'язок</div>
                <div class="nav-item active">Налаштування</div>
            </nav>
            <div class="logout" onclick="logoutUser()">Вийти</div>
        </aside>

        <main class="main-content">
        <form action="save_settings.php" method="POST">    
            <h1>Налаштування</h1>

            <div class="card settings-section">
                <div class="section-header">
                    <span>👤</span> <h3>Профіль</h3>
                </div>
                <div class="input-group">
                    <label>Ім'я</label>
                    <input type="text" name="name" value="<?= htmlspecialchars($user['name']) ?>">
                </div>
                <div class="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value="<?= htmlspecialchars($user['email']) ?>">
                </div>
                <div class="input-group">
                    <button type="button" class="btn-main" onclick="alert('Функція поки недоступна')">Змінити пароль</button>
                </div>
            </div>

            <div class="card settings-section">
                <div class="section-header">
                    <span>$</span> <h3>Бюджет</h3>
                </div>
                <div class="input-group">
                    <label>Місячний ліміт витрат (₴)</label>
                    <input type="number" name="limit" value="<?= $limit ?>">
                </div>
                <div class="input-group">
                    <label>Валюта</label>
                    <select name="currency">
                        <option value="UAH" <?= $settings['currency']=='UAH'?'selected':'' ?>>₴ Гривня</option>
                        <option value="USD" <?= $settings['currency']=='USD'?'selected':'' ?>>$ Долар</option>
                        <option value="EUR" <?= $settings['currency']=='EUR'?'selected':'' ?>>€ Євро</option>
                    </select>
                </div>
            </div>

            <div class="card settings-section">
                <div class="section-header">
                    <h3>Налаштування програми</h3>
                </div>
                <div class="toggle-group">
                    <p>Сповіщення про перевищення бюджету</p>
                    <label class="switch">
                        <input type="checkbox" checked>
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <button type="submit" class="btn-action btn-save" onclick="alert('Зміни збережено успішно!')">
                Зберегти зміни
            </button>
        </form>
        </main>
    </div>
    <script>
        function logoutUser() {
            window.location.href = '../auth/logout.php';
        }
    </script>
</body>
</html>