<?php
session_start();
require '../db.php';

if (!isset($_SESSION['user_id'])) {
    exit("Not authorized");
}

$user_id = $_SESSION['user_id'];

$name = $_POST['name'];
$email = $_POST['email'];
$currency = $_POST['currency'];
$limit = $_POST['limit'];

// 1. Оновлення користувача
$sql = "UPDATE users SET name=?, email=? WHERE user_id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $name, $email, $user_id);
$stmt->execute();

// 2. Оновлення налаштувань
$sql = "UPDATE settings SET currency=? WHERE user_id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $currency, $user_id);
$stmt->execute();

// 3. Оновлення бюджету (ДОРОБИТИ/ПРИБРАТИ)
// (простий варіант — додаємо новий запис)
$sql = "INSERT INTO budgets (user_id, limit_amount, period_start, period_end)
        VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH))";

$stmt = $conn->prepare($sql);
$stmt->bind_param("id", $user_id, $limit);
$stmt->execute();

header("Location: settings.php");
exit();
?>