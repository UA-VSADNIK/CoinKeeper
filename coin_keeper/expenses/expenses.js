// 1. Видалення транзакції
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
        } else {
            alert(res);
        }
    });
}

// 2. Показати всі транзакції
function showAllTransactions() {
    const incomeRows = document.querySelectorAll(".income");

    incomeRows.forEach(row => {
        row.style.display = "table-row";
    });

    document.getElementById("show-all-btn").style.display = "none";
    document.getElementById("hide-all-btn").style.display = "inline-block";

     document.getElementById("table-title").textContent = "Транзакції";
}


// 3. Сховати траназкції поповнення
function hideIncomeTransactions() {
    const incomeRows = document.querySelectorAll(".income");

    incomeRows.forEach(row => {
        row.style.display = "none";
    });

    document.getElementById("show-all-btn").style.display = "inline-block";
    document.getElementById("hide-all-btn").style.display = "none";

    document.getElementById("table-title").textContent = "Витрати";
}


// 4. При старті сторінки ховаємо income
document.addEventListener("DOMContentLoaded", () => {

    const incomeRows = document.querySelectorAll(".income");

    incomeRows.forEach(row => {
        row.style.display = "none";
    });
});