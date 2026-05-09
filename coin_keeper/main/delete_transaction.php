<?php
session_start();

require '../db.php';
require '../auth/auth_check.php';

$user_id = $_SESSION['user_id'];
$id = intval($_POST['id']);

// 1. Отримуємо транзакцію
$sql = "SELECT amount, type FROM transactions
        WHERE transaction_id = ? AND user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id, $user_id);
$stmt->execute();

$result = $stmt->get_result();

// 2. Перевірка чи існує дана транзакція у БД
if ($result->num_rows === 0) {
    exit("Транзакцію не знайдено");
}

$transaction = $result->fetch_assoc();


// 3. Якщо тип транзакції дохід — перевіряємо баланс
if ($transaction['type'] === 'income') {

    // 3.1. Поточний баланс
    $sqlBalance = "SELECT
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) -
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS balance
        FROM transactions
        WHERE user_id = ?";

    $stmtBalance = $conn->prepare($sqlBalance);
    $stmtBalance->bind_param("i", $user_id);
    $stmtBalance->execute();

    $balanceResult = $stmtBalance->get_result()->fetch_assoc();
    $balance = $balanceResult['balance'] ?? 0;

    // 3.2. Баланс після видалення
    $newBalance = $balance - $transaction['amount'];

    if ($newBalance < 0) {
        exit("Неможливо видалити поповнення — баланс стане від'ємним");
    }
}


// 4. Видаляємо транзакцію
$sqlDelete = "DELETE FROM transactions WHERE transaction_id = ? AND user_id = ?";

$stmtDelete = $conn->prepare($sqlDelete);
$stmtDelete->bind_param("ii", $id, $user_id);

if ($stmtDelete->execute()) {
    echo "OK";
} else {
    echo "Помилка видалення";
}
?>