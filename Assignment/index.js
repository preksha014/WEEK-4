$(document).ready(function () {
    // Intialize groups and expenses array with empty or existing elements of an array
    // parse--> convert string into array of objects
    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Save data to local storage
    // Local storage only stores string-->stringify convert array of object into string
    function saveToLocalStorage() {
        localStorage.setItem("groups", JSON.stringify(groups));
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    // Render Groups
    function renderGroups() {
        //Add li of group element in Groups container
        $("#groupList").html(groups.map((g, index) =>
            `<li class="flex justify-between p-2 border">
                ${g.name}
                <div>
                    <button onclick="editGroup(${index})" class="bg-yellow-500 text-white px-5 py-1">Edit</button>
                    <button onclick="deleteGroup(${index})" class="bg-red-500 text-white px-2 py-1">Delete</button>
                </div>
            </li>
            <p class="text-sm text-gray-500">Created: ${moment(g.createdAt).format("YYYY-MM-DD,h:mm A")} | Updated: ${moment(g.updatedAt).format("YYYY-MM-DD, h:mm A")}</p>`
        ));
    }

    // Render Expenses
    // default value of filteredExpense --> expenses
    function renderExpenses(filteredExpenses = expenses) {
        $("#expenseList").html(filteredExpenses.map((e, index) =>
            `<li class="flex justify-between p-2 border">
                ${e.name} - ₹${e.amount} (${e.group})
                <div>
                    <button onclick="editExpense(${index})" class="bg-yellow-500 text-white px-5 py-1">Edit</button>
                    <button onclick="deleteExpense(${index})" class="bg-red-500 text-white px-2 py-1">Delete</button>
                </div>
            </li>
            <p class="text-sm text-gray-500">Expense Date: ${moment(e.date).format("YYYY-MM-DD")}</p>`
        ));
        // console.log(filteredExpenses);
    }
    // Search Expenses
    $("#searchBtn").click(function () {
        let searchQuery = $("#searchExpense").val().trim();

        //add all expenses with searchQuery in fileteredExpenses
        if (searchQuery) {
            let filteredExpenses = expenses.filter(e =>
                e.name.includes(searchQuery)
            );
            renderExpenses(filteredExpenses);
        }
    });

    // Update Summary
    function updateSummary() {
        let totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

        let highestExpense = expenses.length ? expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]) : { name: "None", amount: 0 };

        $("#totalExpense").text(`₹${totalExpense}`);
        $("#highestExpense").text(`${highestExpense.name} - ₹${highestExpense.amount}`);
        saveToLocalStorage();
    }

    // Update Filtered Summary
    function updateFilteredSummary() {
        let selectedMonth = $("#monthFilter").val();
        let selectedGroup = $("#groupFilter").val();

        let filteredExpenses = expenses.filter(e =>
            (!selectedMonth || moment(e.date).format("YYYY-MM") === selectedMonth) && (!selectedGroup || e.group === selectedGroup)
        );

        let filteredMonthlyTotal = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        let filteredGroupTotal = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

        $("#filteredMonthlyExpense").text(`₹${filteredMonthlyTotal}`);
        $("#filteredGroupExpense").text(`₹${filteredGroupTotal}`);

        // Render filtered expenses    
        renderExpenses(filteredExpenses);
    }

    // Event Listeners for Filters
    $("#monthFilter, #groupFilter").on("change", updateFilteredSummary);

    // Populate Group Filter Dropdown
    function populateGroupFilterDropdown() {
        let groupFilter = $("#groupFilter");
        groupFilter.html('<option value="">All Groups</option>');
        groups.forEach(group => {
            groupFilter.append(`<option value="${group.name}">${group.name}</option>`);
        });
        saveToLocalStorage();
        renderGroups();
    }

    // Initial population of the group filter dropdown
    populateGroupFilterDropdown();

    //Group Dropdown for Expense
    function populateGroupDropdown() {
        let groupDropdown = $("#expenseGroup");
        groupDropdown.html('<option value="">Select Group</option>');
        groups.forEach(group => {
            groupDropdown.append(`<option value="${group.name}">${group.name}</option>`);
        });
    }

    // Save Group
    $("#saveGroup").click(function () {
        let index = $("#groupIndex").val();
        let name = $("#groupName").val().trim();

        if (!name) return alert("Group name is required!");

        if (!index && groups.some(g => g.name === name)) {
            return alert("Group name already exists!");
        }

        let now = moment().format("YYYY-MM-DD HH:mm:ss");
        if (index) {
            if (groups[index].name === name) {
                return alert("No changes detected in group details.");
            }
            groups[index].name = name;
            groups[index].updatedAt = now;
        } else {
            groups.push({ name, createdAt: now, updatedAt: now });
        }

        saveToLocalStorage();
        renderGroups();
        populateGroupDropdown();
        populateGroupFilterDropdown();
        $("#groupModal").addClass("hidden");
        $("#groupName").val("");
    });

    // Save Expense
    $("#saveExpense").click(function () {
        let index = $("#expenseIndex").val();
        let name = $("#expenseName").val().trim();
        let amount = parseFloat($("#expenseAmount").val().trim());
        let date = $("#expenseDate").val().trim();
        let group = $("#expenseGroup").val().trim();

        if (!name || isNaN(amount) || amount <= 0 || !date || !group) return alert("All fields are required!");

        if (!index && expenses.some(e => e.name === name && e.amount === amount && e.date === date && e.group === group)) {
            return alert("Same expense already exists!");
        }

        let expense = { name, amount, date, group };
        console.log(index);
        if (index) {
            expenses[index] = expense;
        } else {
            expenses.push(expense);
        }

        saveToLocalStorage();
        renderExpenses();
        updateSummary();
        updateFilteredSummary();
        $("#expenseModal").addClass("hidden");
        $("#expenseName, #expenseAmount, #expenseDate, #expenseGroup").val("");
    });

    // Open Group Modal
    $("#openGroupModal").click(() => {
        $("#groupModal").removeClass("hidden");
    });

    // Open Expense Modal
    $("#openExpenseModal").click(() => {
        populateGroupDropdown();
        $("#expenseModal").removeClass("hidden");
    });

    // Close Group Modal
    $("#closeGroupModal").click(() => {
        $("#groupModal").addClass("hidden");
    });

    // Close Expense Modal
    $("#closeExpenseModal").click(() => {
        $("#expenseModal").addClass("hidden");
    });

    // Edit Group
    window.editGroup = function (index) {
        $("#groupIndex").val(index);
        $("#groupName").val(groups[index].name);
        $("#groupModal").removeClass("hidden");
        populateGroupFilterDropdown();
        populateGroupDropdown();
    };

    // Delete Group
    window.deleteGroup = function (index) {
        let groupName = groups[index].name;
        groups.splice(index, 1);
        expenses = expenses.filter(e => e.group !== groupName);
        saveToLocalStorage();
        renderGroups();
        renderExpenses();
        populateGroupDropdown();
        populateGroupFilterDropdown();
        updateSummary();
        updateFilteredSummary();
    };

    // Edit Expense
    window.editExpense = function (index) {
        $("#expenseIndex").val(index);
        $("#expenseName").val(expenses[index].name);
        $("#expenseAmount").val(expenses[index].amount);
        $("#expenseDate").val(expenses[index].date);
        $("#expenseGroup").val(expenses[index].group);
        $("#expenseModal").removeClass("hidden");
    };

    // Delete Expense
    window.deleteExpense = function (index) {
        expenses.splice(index, 1);
        saveToLocalStorage();
        renderExpenses();
        updateSummary();
        updateFilteredSummary();
    };

    // Initial Render
    renderGroups();
    renderExpenses();
    updateSummary();
});
