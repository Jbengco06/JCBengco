document.addEventListener('DOMContentLoaded', loadLevel3Items);

function loadLevel3Items() {
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
            displayLevel3Items(data.data);
        } else {
            alert('Error loading items: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error loading items. Check console for details.');
    });
}

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

function displayLevel3Items(items) {
    const tbody = document.getElementById('level3-body');
    tbody.innerHTML = '';

    // Only show Level 3 items
    const level3Items = items.filter(item => item.level === 'Level_3');

    if (!level3Items.length) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center;">No Level 3 items found</td>';
        tbody.appendChild(row);
        return;
    }

    level3Items.forEach(item => {
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

function updateQuantity(id, newQuantity) {
    if (newQuantity < 0) return;
    fetch('inventory_operations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
                    loadLevel3Items();
                }
            });
        }
    });
}

function manualQuantityUpdate(id, value) {
    const newQuantity = parseInt(value, 10);
    if (isNaN(newQuantity) || newQuantity < 0) return;
    fetch('inventory_operations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
                    loadLevel3Items();
                }
            });
        }
    });
}

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
                        loadLevel3Items();
                    }
                });
            };
        }
    });
}

document.getElementById('closeEditModalBtn').addEventListener('click', () => {
    document.getElementById('editItemModal').style.display = 'none';
});

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
                loadLevel3Items();
            }
        });
    }
}

document.getElementById('addBtn').addEventListener('click', () => {
    const name = document.getElementById('itemNameInput').value;
    // Case-sensitive duplicate check
    if (allLevel3Items.some(item => item.name === name)) {
        alert('An item with this exact name already exists. Please use a different name.');
        return;
    }
    const quantity = document.getElementById('itemQtyInput').value;
    const maxQuantity = document.getElementById('maxQuantity').value;
    const level = document.getElementById('itemLevelCategory').value;
    const category = document.getElementById('itemCategoryInput').value;

    if (!name || quantity === '' || maxQuantity === '' || !level || !category) {
        alert('Please fill in all fields.');
        return;
    }

    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('name', name);
    formData.append('quantity', quantity);
    formData.append('maxQuantity', maxQuantity);
    formData.append('level', level);
    formData.append('category', category);

    fetch('inventory_operations.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('addItemModal').style.display = 'none';
            loadLevel3Items();
            // Clear form fields
            document.getElementById('itemNameInput').value = '';
            document.getElementById('itemQtyInput').value = '';
            document.getElementById('maxQuantity').value = '';
            document.getElementById('itemLevelCategory').selectedIndex = 0;
            document.getElementById('itemCategoryInput').selectedIndex = 0;
        }
    })
    .catch(error => console.error('Error:', error));
});