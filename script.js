// DOM Elements
const form = document.getElementById("transaction-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const list = document.getElementById("transaction-list");

const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");

// Load transactions from LocalStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Enable category only for expense
typeInput.addEventListener("change", function () {
    if (typeInput.value === "expense") {
        categoryInput.disabled = false;
    } else {
        categoryInput.disabled = true;
        categoryInput.value = "";
    }
});

// Form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (title === "" || amount <= 0) {
        alert("Please enter valid data");
        return;
    }

    if (type === "expense" && category === "") {
        alert("Please select a category");
        return;
    }

    const transaction = {
        id: Date.now(),
        title: title,
        amount: amount,
        type: type,
        category: type === "expense" ? category : null
    };

    transactions.push(transaction);
    updateLocalStorage();
    renderTransactions();
    form.reset();
    categoryInput.disabled = true;
});

// Render transactions
function renderTransactions() {
    list.innerHTML = "";

    transactions.forEach(function (t) {
        const li = document.createElement("li");
        li.classList.add(t.type);

        let text = `${t.title} - ₹${t.amount}`;
        if (t.type === "expense") {
            text += ` (${t.category})`;
        }

        li.innerHTML = `
            ${text}
            <span class="delete-btn" onclick="deleteTransaction(${t.id})">X</span>
        `;

        list.appendChild(li);
    });

    updateSummary();
}

// Update summary
function updateSummary() {
    let income = 0;
    let expense = 0;

    transactions.forEach(function (t) {
        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }
    });

    incomeEl.textContent = `₹${income}`;
    expenseEl.textContent = `₹${expense}`;
    balanceEl.textContent = `₹${income - expense}`;
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(function (t) {
        return t.id !== id;
    });

    updateLocalStorage();
    renderTransactions();
}

// Save to LocalStorage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initial render
renderTransactions();
