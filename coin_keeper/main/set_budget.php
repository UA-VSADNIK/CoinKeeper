<?php
session_start();

require '../db.php';
require '../auth/auth_check.php';


$user_id = $_SESSION['user_id'];

// 1. Отримуємо дані з форми
$amount = floatval($_POST['amount']);
$period = $_POST['period'];


// 2. Перевіряємо дані з форми
if ($amount <= 0 || !$period) {
    exit("Невірні дані");
}


// 3. Визначення початку та кінця періоду 
// - користувач лише обирає на скільки період (1 тижден, 1 місяць, 3 місяці, рік)
// - у БД воно зберігається як початок періоду та кінецб періоду
$start = date('Y-m-d');

switch ($period) {
    case 'week':
        $end = date('Y-m-d', strtotime('+7 days'));
        break;
    case 'month':
        $end = date('Y-m-d', strtotime('+1 month'));
        break;
    case '3months':
        $end = date('Y-m-d', strtotime('+3 months'));
        break;
    case 'year':
        $end = date('Y-m-d', strtotime('+1 year'));
        break;
    default:
        exit("Невірний період");
}


// 4. Видалення старого бюджету
$sqlDelete = "DELETE FROM budgets WHERE user_id = ?";

$stmtDelete = $conn->prepare($sqlDelete);
$stmtDelete->bind_param("i", $user_id);
$stmtDelete->execute();


// 5. Стоврення нового бюджету та внесення його у БД
$sql = "INSERT INTO budgets (user_id, limit_amount, period_start, period_end) VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("idss", $user_id, $amount, $start, $end);

if ($stmt->execute()) {
    echo "OK";
} else {
    echo "Помилка збереження";
}
?>