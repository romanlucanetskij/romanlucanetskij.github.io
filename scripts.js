// scripts.js

// Ініціалізація записів з LocalStorage або порожній масив
let records = JSON.parse(localStorage.getItem('repairRecords')) || [];

// Функція для відображення записів
function displayRecords(recordsToDisplay) {
    const allRecordsDiv = document.getElementById('all-records');
    if (!allRecordsDiv) return;

    if (recordsToDisplay.length === 0) {
        allRecordsDiv.innerHTML = "<p>Немає записів для відображення.</p>";
        return;
    }

    let tableHTML = `
        <table>
            <tr>
                <th>№</th>
                <th>Місто</th>
                <th>Адреса</th>
                <th>Вид Робіт</th>
                <th>Вартість (грн)</th>
                <th>Дата Початку</th>
                <th>Дата Завершення</th>
                <th>Дії</th>
            </tr>
    `;

    recordsToDisplay.forEach((record, index) => {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${record.city}</td>
                <td>${record.address}</td>
                <td>${record.work_type}</td>
                <td>${record.cost.toFixed(2)}</td>
                <td>${record.start_date}</td>
                <td>${record.end_date}</td>
                <td>
                    <button class="action-btn" onclick="editRecord(${index})">Редагувати</button>
                    <button class="action-btn" onclick="deleteRecord(${index})">Видалити</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `</table>`;
    allRecordsDiv.innerHTML = tableHTML;
}

// Функція для додавання нового запису
document.getElementById('addForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const city = document.getElementById('city').value.trim();
    const address = document.getElementById('address').value.trim();
    const work_type = document.getElementById('work_type').value.trim();
    const cost = parseFloat(document.getElementById('cost').value);
    const start_date = document.getElementById('start_date').value;
    const end_date = document.getElementById('end_date').value;

    // Валідація даних
    if (isNaN(cost) || cost < 0) {
        document.getElementById('addMessage').textContent = "Вартість повинна бути позитивним числом.";
        document.getElementById('addMessage').style.color = "red";
        return;
    }

    // Додавання нового запису
    const newRecord = { city, address, work_type, cost, start_date, end_date };
    records.push(newRecord);
    localStorage.setItem('repairRecords', JSON.stringify(records));

    // Оновлення відображення
    displayRecords(records);

    // Очистка форми
    document.getElementById('addForm').reset();

    // Відображення повідомлення
    document.getElementById('addMessage').textContent = "Запис успішно додано!";
    document.getElementById('addMessage').style.color = "green";
});

// Функція для видалення запису
function deleteRecord(index) {
    if (confirm('Ви дійсно хочете видалити цей запис?')) {
        records.splice(index, 1);
        localStorage.setItem('repairRecords', JSON.stringify(records));
        displayRecords(records);
    }
}

// Функція для редагування запису
function editRecord(index) {
    const record = records[index];
    const newCity = prompt("Введіть нове місто:", record.city);
    if (newCity === null) return; // Скасування

    const newAddress = prompt("Введіть нову адресу:", record.address);
    if (newAddress === null) return;

    const newWorkType = prompt("Введіть новий вид робіт:", record.work_type);
    if (newWorkType === null) return;

    const newCost = prompt("Введіть нову вартість (грн):", record.cost);
    if (newCost === null) return;
    const parsedCost = parseFloat(newCost);
    if (isNaN(parsedCost) || parsedCost < 0) {
        alert("Вартість повинна бути позитивним числом.");
        return;
    }

    const newStartDate = prompt("Введіть нову дату початку:", record.start_date);
    if (newStartDate === null) return;

    const newEndDate = prompt("Введіть нову дату завершення:", record.end_date);
    if (newEndDate === null) return;

    // Оновлення запису
    records[index] = {
        city: newCity.trim(),
        address: newAddress.trim(),
        work_type: newWorkType.trim(),
        cost: parsedCost,
        start_date: newStartDate,
        end_date: newEndDate
    };

    localStorage.setItem('repairRecords', JSON.stringify(records));
    displayRecords(records);
}

// Функція для сортування записів за вартістю
document.getElementById('sortBtn').addEventListener('click', function() {
    records.sort((a, b) => a.cost - b.cost);
    localStorage.setItem('repairRecords', JSON.stringify(records));
    displayRecords(records);
});

// Функція для фільтрації записів
document.getElementById('filterForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const min_cost = parseFloat(document.getElementById('min_cost').value);
    const city_filter = document.getElementById('city_filter').value.trim().toLowerCase();
    const address_filter = document.getElementById('address_filter').value.trim().toLowerCase();

    let filtered = records;

    if (!isNaN(min_cost)) {
        filtered = filtered.filter(record => record.cost > min_cost);
    }

    if (city_filter !== "") {
        filtered = filtered.filter(record => record.city.toLowerCase() === city_filter);
    }

    if (address_filter !== "") {
        filtered = filtered.filter(record => record.address.toLowerCase() === address_filter);
    }

    const filteredRecordsDiv = document.getElementById('filtered-records');
    if (filtered.length === 0) {
        filteredRecordsDiv.innerHTML = "<p>Нічого не знайдено за заданими критеріями.</p>";
        return;
    }

    let tableHTML = `
        <table>
            <tr>
                <th>№</th>
                <th>Місто</th>
                <th>Адреса</th>
                <th>Вид Робіт</th>
                <th>Вартість (грн)</th>
                <th>Дата Початку</th>
                <th>Дата Завершення</th>
                <th>Дії</th>
            </tr>
    `;

    filtered.forEach((record, index) => {
        const realIndex = records.indexOf(record);
        tableHTML += `
            <tr>
                <td>${realIndex + 1}</td>
                <td>${record.city}</td>
                <td>${record.address}</td>
                <td>${record.work_type}</td>
                <td>${record.cost.toFixed(2)}</td>
                <td>${record.start_date}</td>
                <td>${record.end_date}</td>
                <td>
                    <button class="action-btn" onclick="editRecord(${realIndex})">Редагувати</button>
                    <button class="action-btn" onclick="deleteRecord(${realIndex})">Видалити</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `</table>`;
    filteredRecordsDiv.innerHTML = tableHTML;
});

// Функція для завантаження записів при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    displayRecords(records);
});
