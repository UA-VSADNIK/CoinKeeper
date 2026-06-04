// 1. Додавання транзакції (поповнення/витрати)
function addTransaction() {
    const cat = document.getElementById('cat-select').value;
    const sum = parseFloat(document.getElementById('sum-input').value);
    const date = document.getElementById('date-input').value;
    const desc = document.getElementById('desc-input').value;

    // Базова перевірка
    if (!sum || sum <= 0 || !cat) {
        alert("Заповніть всі поля коректно!");
        return;
    }

    const data = new FormData();
    data.append("category", cat);
    data.append("amount", sum);
    data.append("type", "expense");
    data.append("date", date);
    data.append("description", desc);

    fetch("add_transaction.php", {
        method: "POST",
        body: data
    })
    .then(res => res.text())
    .then(res => {
        if (res === "OK") {
            location.reload();
        } 
        else if (res === "LIMIT_EXCEEDED") {
            alert("Увага! Встановлений ліміт витрат перевищено.");
            location.reload();
        } 
        else {
            alert(res); // покажемо помилку з PHP
        }
    });
}


// 2. Видалення транзакції
function deleteTransaction(id) {
    if (!confirm("Видалити транзакцію?")) return;

    const data = new FormData();
    data.append("id", id);

    fetch("delete_transaction.php", {
        method: "POST",
        body: data
    })
    .then(res => res.text())
    .then(res => {
        if (res === "OK") {
            location.reload();
        } 
        else {
            alert(res);
        }
    });
}


// 3. Форма поповнення балансу
// 3.1 Відкрити вікно
function topUpBalance() {
    const modal = document.getElementById('topup-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('modal-amount-input').focus();
    }
}

// 3.2 Закрити вікно
function closeTopUpModal() {
    document.getElementById('topup-modal').style.display = 'none';
    document.getElementById('modal-amount-input').value = '';
}

// 3.3 Підтвердити
function confirmTopUp() {
    const amount = parseFloat(document.getElementById("modal-amount-input").value);

    if (!amount || amount <= 0) {
        alert("Введіть коректну суму");
        return;
    }

    const data = new FormData();
    data.append("category", "income");
    data.append("amount", amount);
    data.append("type", "income");
    data.append("date", new Date().toISOString().split('T')[0]);
    data.append("description", "Поповнення");

    fetch("add_transaction.php", {
        method: "POST",
        body: data
    })
    .then(res => res.text())
    .then(res => {
        if (res === "OK") {
            location.reload();
        } else {
        alert(res);
    }
    })
    .catch(() => alert("Помилка мережі"));
}



// 4. Форма встановлення ліміту
// 4.1. Відкрити вікно
function openLimitModal() {
    const modal = document.getElementById('limit-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('limit-amount-input').focus();
    }
}

// 4.2. Закрити вікно
function closeLimitModal() {
    document.getElementById('limit-modal').style.display = 'none';
    document.getElementById('limit-amount-input').value = '';
    document.getElementById('limit-period-select').value = 'month';
}

// 4.3 Підтвердити
function confirmLimit() {
    const amount = parseFloat(document.getElementById('limit-amount-input').value);
    const period = document.getElementById('limit-period-select').value;

    if (!amount || amount <= 0) {
        alert("Введіть коректний ліміт");
        return;
    }

    const data = new FormData();

    data.append("amount", amount);
    data.append("period", period);

    fetch("set_budget.php", {
        method: "POST",
        body: data
    })
    .then(res => res.text())
    .then(res => {
        if (res === "OK") {
            alert("Ліміт успішно встановлено");
            closeLimitModal();
            location.reload();
        } else {
            alert(res);
        }
    })
    .catch(() => {
        alert("Помилка мережі");
    });
}


// 5. Закриття вікна форми поповнення/ліміту при кліку на фон
window.addEventListener('click', (event) => {

    const topupModal = document.getElementById('topup-modal');
    const limitModal = document.getElementById('limit-modal');

    if (event.target === topupModal) {
        closeTopUpModal();
    }

    if (event.target === limitModal) {
        closeLimitModal();
    }
});