<?php
session_start();

require '../db.php';
require '../auth/auth_check.php';

$user_id = $_SESSION['user_id'];

// 1. Завантаження даних з форми
$category = trim($_POST['category']);
$amount = $_POST['amount'];
$type = $_POST['type'];
$date = $_POST['date'];
$desc = $_POST['description'];

// 2. Перевірка даних з форми
if (!$category || !$amount || !$type || !$date) {
    exit("Невірні дані");
}

// 3. Якщо тип транзакції витрата — перевіряємо баланс
if ($type === 'expense') {
    $sql = "SELECT 
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) -
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS balance
        FROM transactions WHERE user_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();

    $balance = $res['balance'] ?? 0;

    if ($amount > $balance) {
        echo "Недостатньо коштів! Баланс: " . number_format($balance, 2) . " ₴";
        exit();
    }
}

// 4. Додаємо транзакцію у БД
$sql = "INSERT INTO transactions 
(user_id, category, amount, type, description, transaction_date)
VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isdsss", $user_id, $category, $amount, $type, $desc, $date);

if ($stmt->execute()) {
    
    // Перевірка перевищення ліміту (витрати)
    $sqlBudget = "SELECT limit_amount FROM budgets WHERE user_id = ?";

    $stmtBudget = $conn->prepare($sqlBudget);
    $stmtBudget->bind_param("i", $user_id);
    $stmtBudget->execute();

    $budget = $stmtBudget->get_result()->fetch_assoc();

    if ($budget) {

        $limit = $budget['limit_amount'];

        $sqlSpent = "SELECT SUM(amount) AS total
                     FROM transactions WHERE user_id = ?
                     AND type='expense'
                     AND YEAR(transaction_date)=YEAR(CURDATE())
                     AND MONTH(transaction_date)=MONTH(CURDATE())";

        $stmtSpent = $conn->prepare($sqlSpent);
        $stmtSpent->bind_param("i", $user_id);
        $stmtSpent->execute();

        $spent = $stmtSpent->get_result()->fetch_assoc()['total'] ?? 0;

        if ($spent > $limit) {
            echo "LIMIT_EXCEEDED";
            exit();
        }
    }
    echo "OK";

} else {
    echo "ERROR";
}