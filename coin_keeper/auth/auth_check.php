<?php
// Якщо користувач НЕ авторизований
if (!isset($_SESSION['user_id'])) {
    header("Location: ../auth/login.html");
    exit();
}
?>