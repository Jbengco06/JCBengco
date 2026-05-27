// Load all items when the page loads
document.addEventListener('DOMContentLoaded', loadItems);

let allItems = [];

// Function to load all items
function loadItems() {
    fetch('inventory_operations.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            allItems = data.data;
            displayItems(allItems);
        } else {
            alert('Error loading items: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error loading items. Check console for details.');
    });
}

// Function to display items in the table
function displayItems(items) {
    const tbody = document.getElementById('inventory-body');
    tbody.innerHTML = '';

    if (!items || items.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center;">No items found</td>';
        tbody.appendChild(row);
      return;
    }
  
    items.forEach(item => {
        const { statusText, statusClass } = calculateStatus(item.quantity, item.max_quantity);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <button class="minus-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" min="0" value="${item.quantity}" style="width: 50px; text-align: center;"
                    onchange="manualQuantityUpdate(${item.id}, this.value)"
                    onkeydown="if(event.key==='Enter'){manualQuantityUpdate(${item.id}, this.value)}">
                <button class="add-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </td>
            <td>${item.category}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <button onclick="editItem(${item.id})" class="edit-btn">✏️</button>
                <button onclick="deleteItem(${item.id})" class="delete-btn">🗑️</button>
      </td>
    `;
        tbody.appendChild(row);
    });
}

// Function to get status based on quantity
function calculateStatus(quantity, maxQuantity) {
    const percent = (quantity / maxQuantity) * 100;
    if (percent <= 30) {
        return { statusText: "Low Stock", statusClass: "low" };
    } else if (percent <= 100) {
        return { statusText: "In Stock", statusClass: "medium" };
    } else {
        return { statusText: "Over Stock", statusClass: "high" };
    }
}

// Add Item Modal
const addModal = document.getElementById('addItemModal');
const openAddModal = document.getElementById('openAddModal');
const closeModalBtn = document.getElementById('closeModalBtn');

openAddModal.addEventListener('click', () => {
    addModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    addModal.style.display = 'none';
});

// Add Item Form Submission
document.getElementById('addBtn').addEventListener('click', () => {
    const name = document.getElementById('itemNameInput').value;
    // Case-insensitive duplicate check
    if (allItems.some(item => item.name.toLowerCase() === name.toLowerCase())) {
        alert('An item with this name already exists. Please use a different name.');
        return;
    }
    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('name', name);
    formData.append('quantity', document.getElementById('itemQtyInput').value);
    formData.append('maxQuantity', document.getElementById('maxQuantity').value);
    formData.append('level', document.getElementById('itemLevelCategory').value);
    formData.append('category', document.getElementById('itemCategoryInput').value);

    fetch('inventory_operations.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addModal.style.display = 'none';
            loadItems();
            // Clear form
            document.getElementById('itemNameInput').value = '';
            document.getElementById('itemQtyInput').value = '';
            document.getElementById('maxQuantity').value = '';
        }
    })
    .catch(error => console.error('Error:', error));
});

// Edit Item
function editItem(id) {
    fetch('inventory_operations.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=get&id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const item = data.data;
            document.getElementById('editItemNameInput').value = item.name;
            document.getElementById('editItemQtyInput').value = item.quantity;
            document.getElementById('editMaxQuantity').value = item.max_quantity;
            document.getElementById('editItemLevelCategory').value = item.level;
            document.getElementById('editItemCategoryInput').value = item.category;
            
            const editModal = document.getElementById('editItemModal');
            editModal.style.display = 'flex';
            
            // Update button click handler
            document.getElementById('editBtn').onclick = () => {
                const formData = new FormData();
                formData.append('action', 'update');
                formData.append('id', id);
                formData.append('name', document.getElementById('editItemNameInput').value);
                formData.append('quantity', document.getElementById('editItemQtyInput').value);
                formData.append('maxQuantity', document.getElementById('editMaxQuantity').value);
                formData.append('level', document.getElementById('editItemLevelCategory').value);
                formData.append('category', document.getElementById('editItemCategoryInput').value);

                fetch('inventory_operations.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        editModal.style.display = 'none';
                        loadItems();
                    }
                })
                .catch(error => console.error('Error:', error));
            };
        }
    })
    .catch(error => console.error('Error:', error));
}

// Delete Item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch('inventory_operations.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=delete&id=${id}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadItems();
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Close Edit Modal
document.getElementById('closeEditModalBtn').addEventListener('click', () => {
    document.getElementById('editItemModal').style.display = 'none';
});

function updateQuantity(id, newQuantity) {
    if (newQuantity < 0) return; // Prevent negative quantities

    // You need to get the item's other data to update it
    fetch('inventory_operations.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=get&id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data) {
            const item = data.data;
            const formData = new FormData();
            formData.append('action', 'update');
            formData.append('id', id);
            formData.append('name', item.name);
            formData.append('quantity', newQuantity);
            formData.append('maxQuantity', item.max_quantity);
            formData.append('level', item.level);
            formData.append('category', item.category);

            fetch('inventory_operations.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadItems();
                }
            });
        }
    });
}

function manualQuantityUpdate(id, value) {
    const newQuantity = parseInt(value, 10);
    if (isNaN(newQuantity) || newQuantity < 0) return;

    // Fetch the item to get all its data
    fetch('inventory_operations.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=get&id=${id}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data) {
            const item = data.data;
            const formData = new FormData();
            formData.append('action', 'update');
            formData.append('id', id);
            formData.append('name', item.name);
            formData.append('quantity', newQuantity);
            formData.append('maxQuantity', item.max_quantity);
            formData.append('level', item.level);
            formData.append('category', item.category);

            fetch('inventory_operations.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadItems();
                }
            });
        }
    });
}

// Add search functionality
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchText = this.value.trim().toLowerCase();
        const filtered = allItems.filter(item =>
            item.name.toLowerCase().includes(searchText) ||
            item.category.toLowerCase().includes(searchText)
        );
        displayItems(filtered);
    });
}

  