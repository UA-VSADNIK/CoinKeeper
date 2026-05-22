<?php
// Якщо користувач ВЖЕ авторизований
if (isset($_SESSION['user_id'])) {

    header("Location: ../main/index.php");
    exit();
}
?>