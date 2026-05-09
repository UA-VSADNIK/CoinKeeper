<?php
session_start();
require '../db.php';

// 1. Отримуємо дані
$name = trim($_POST['name']);
$email = trim($_POST['email']);
$password = $_POST['password'];
$currency = $_POST['currency'];

// 2. Перевірка чи існує email
$check_sql = "SELECT user_id FROM users WHERE email = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();

$check_result = $check_stmt->get_result();

if ($check_result->num_rows > 0) {
    echo "Користувач з таким email вже існує";
    exit();
}

// 3. Поки без хешування
$password_hash = $password;

// 4. Додаємо користувача
$sql = "INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $password_hash);

if ($stmt->execute()) {

    $user_id = $stmt->insert_id;

    // Зберігаємо сесію (ID користувача)
    $_SESSION['user_id'] = $user_id;

    // settings
    $sql2 = "INSERT INTO settings (user_id, currency)
             VALUES (?, ?)";

    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("is", $user_id, $currency);
    $stmt2->execute();

    // Редірект на головну сторінку
    header("Location: ../main/index.php");
    exit();

} else {
    echo "Помилка: " . $conn->error;
}

$conn->close();
?>