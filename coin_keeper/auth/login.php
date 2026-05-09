<?php
session_start();
require '../db.php';

// 1. Отримуємо дані
$email = trim($_POST['email']);
$password = $_POST['password'];

// 2. Шукаємо користувача
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // 3. Без хешування
    if ($password === $user['password_hash']) {

        $_SESSION['user_id'] = $user['user_id'];

        // Редірект
        header("Location: ../main/index.php");
        exit();

    } else {
        echo "Невірний пароль";
    }

} else {
    echo "Користувача не знайдено";
}

$conn->close();
?>