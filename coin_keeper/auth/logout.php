<?php
session_start();

// 1. Очищаємо всі змінні сесії
$_SESSION = [];

// 2. Знищуємо сесію
session_destroy();

// 3. Видаляємо cookie сесії
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 4. Перенаправлення на сторінку логіну
header("Location: login.html");
exit();
?>