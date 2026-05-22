У даному файлі мною наведена інструкція щодо правильного завантаження татестування розробленого сайту.

Завантажити всі файли (да, без цього ніяк 🙂)
Завантажити XAMPP (Apachee Server та MySQL) і встановити у зручну Вам директорію (у мене це диск "D").
Завантажити VS Code (Я через нього все робив, хочв можна працювати і з іншим редактором).
ОБОВ'ЯЗКОВО помістити файли проєкту "coin_keeper" у "D:\XAMPP\htdocs".
Розархівувати файл "coin_keeper" у "D:\XAMPP\mysql\data" - це БД.
<=== СТВОРЕННЯ БД ===> DROP DATABASE IF EXISTS coin_keeper;

CREATE DATABASE coin_keeper; USE coin_keeper;

-- 1. USERS CREATE TABLE users ( user_id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

-- 2. SETTINGS CREATE TABLE settings ( user_id INT PRIMARY KEY, currency VARCHAR(5) DEFAULT 'USD', language VARCHAR(5) DEFAULT 'EN',

FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

-- 3. TRANSACTIONS CREATE TABLE transactions ( transaction_id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT NOT NULL,

category VARCHAR(50) NOT NULL,

amount DECIMAL(10,2) NOT NULL,

type ENUM('income', 'expense') NOT NULL,

description VARCHAR(255),

transaction_date DATE NOT NULL,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

-- 4. BUDGETS CREATE TABLE budgets ( budget_id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT NOT NULL,

limit_amount DECIMAL(10,2) NOT NULL,

period_start DATE NOT NULL,

period_end DATE NOT NULL,

FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);
