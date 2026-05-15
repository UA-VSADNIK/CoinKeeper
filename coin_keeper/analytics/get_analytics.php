<?php

session_start();

require '../db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit();
}

$user_id = $_SESSION['user_id'];

$period = $_GET['period'] ?? 'week';


// ПЕРІОД
switch ($period) {

    case 'month':
        $date_from = date('Y-m-d', strtotime('-1 month'));
        break;

    case 'year':
        $date_from = date('Y-m-d', strtotime('-1 year'));
        break;

    default:
        $date_from = date('Y-m-d', strtotime('-7 days'));
}


// SQL
$sql = "
SELECT
    DATE(transaction_date) as d,
    category,
    SUM(amount) as total

FROM transactions

WHERE user_id = ?
AND type = 'expense'
AND transaction_date >= ?

GROUP BY d, category

ORDER BY d ASC
";


$stmt = $conn->prepare($sql);

$stmt->bind_param("is", $user_id, $date_from);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);