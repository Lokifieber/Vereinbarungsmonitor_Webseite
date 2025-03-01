document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.getElementById("menu");
    const body = document.body;
    let db;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark-mode") {
        body.classList.add("dark-mode");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDarkMode = body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDarkMode ? "dark-mode" : "light-mode");
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.style.right = menu.style.right === "0px" ? "-250px" : "0px";
    });

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.style.right = "-250px";
        }
    });

    const request = indexedDB.open("VereinbarungsmonitorDB", 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("vereinbarungen")) {
            db.createObjectStore("vereinbarungen", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        loadData();
    };

    request.onerror = function (event) {
        console.error("IndexedDB Fehler:", event.target.error);
    };

    // Daten in die Datenbank einfügen
    function addEntry(name, versanddatum, mitarbeiter) {
        const transaction = db.transaction("vereinbarungen", "readwrite");
        const store = transaction.objectStore("vereinbarungen");
        const entry = { name, versanddatum, mitarbeiter, unterschrieben: false };
        store.add(entry);

        transaction.oncomplete = function () {
            loadData();
        };
    }

    function loadData() {
        const transaction = db.transaction("vereinbarungen", "readonly");
        const store = transaction.objectStore("vereinbarungen");
        const request = store.getAll();

        request.onsuccess = function () {
            const data = request.result;
            updateTables(data);
            updateChart(data);
        };
    }

    function updateTables(data) {
        const allEntriesTableBody = document.querySelector("#allEntriesTable tbody");
        allEntriesTableBody.innerHTML = data.map(entry => `
            <tr>
                <td>${entry.name}</td>
                <td>${entry.versanddatum}</td>
                <td>${entry.mitarbeiter}</td>
                <td><input type="checkbox" ${entry.unterschrieben ? "checked" : ""} onchange="toggleSigned(${entry.id}, this.checked)"></td>
                <td><button onclick="deleteEntry(${entry.id})">🗑️</button></td>
            </tr>
        `).join("");
    }

    window.toggleSigned = function (id, isSigned) {
        const transaction = db.transaction("vereinbarungen", "readwrite");
        const store = transaction.objectStore("vereinbarungen");
        const request = store.get(id);

        request.onsuccess = function () {
            const entry = request.result;
            entry.unterschrieben = isSigned;
            store.put(entry);

            transaction.oncomplete = function () {
                loadData();
            };
        };
    };

    window.deleteEntry = function (id) {
        const transaction = db.transaction("vereinbarungen", "readwrite");
        const store = transaction.objectStore("vereinbarungen");
        store.delete(id);

        transaction.oncomplete = function () {
            loadData();
        };
    };

    document.getElementById("newEntryForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const versanddatum = document.getElementById("versanddatum").value;
        const mitarbeiter = document.getElementById("mitarbeiter").value;
        addEntry(name, versanddatum, mitarbeiter);
        this.reset();
    });

    document.getElementById("exportList").addEventListener("click", function () {
        const transaction = db.transaction("vereinbarungen", "readonly");
        const store = transaction.objectStore("vereinbarungen");
        const request = store.getAll();

        request.onsuccess = function () {
            const data = request.result;
            const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "vereinbarungen.json";
            a.click();
            URL.revokeObjectURL(url);
        };
    });

    document.getElementById("importList").addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = function (e) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const data = JSON.parse(event.target.result);
                const transaction = db.transaction("vereinbarungen", "readwrite");
                const store = transaction.objectStore("vereinbarungen");
                data.forEach(entry => store.add(entry));

                transaction.oncomplete = function () {
                    loadData();
                };
            };

            reader.readAsText(file);
        };

        input.click();
    });

    document.getElementById("aboutAuthor").addEventListener("click", function () {
        alert("Autor: Loki & KI: 1.0");
    });

    function updateChart(data) {
        const signed = data.filter(entry => entry.unterschrieben).length;
        const unsigned = data.length - signed;

        const ctx = document.getElementById("vereinbarungenChart").getContext("2d");
        if (window.myChart) {
            window.myChart.destroy();
        }
        window.myChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Unterschrieben", "Nicht unterschrieben"],
                datasets: [{
                    data: [signed, unsigned],
                    backgroundColor: ["#4CAF50", "#FF5252"],
                }],
            },
        });
    }
});