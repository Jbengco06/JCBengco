// Fetch all items and display low stock notifications

document.addEventListener('DOMContentLoaded', () => {
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
            displayLowStockNotifications(data.data);
        } else {
            document.getElementById('notificationList').innerHTML = '<div class="notification-item">Error loading items: ' + data.message + '</div>';
        }
    })
    .catch(error => {
        document.getElementById('notificationList').innerHTML = '<div class="notification-item">Error loading items. Check console for details.</div>';
        console.error('Error:', error);
    });
});

function displayLowStockNotifications(items) {
    const notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = '';
    // Consider low stock as quantity <= 30% of max_quantity
    const lowStockItems = items.filter(item => {
        const maxQ = parseInt(item.max_quantity, 10);
        const q = parseInt(item.quantity, 10);
        return maxQ > 0 && q <= Math.floor(maxQ * 0.3);
    });

    if (lowStockItems.length === 0) {
        notificationList.innerHTML = '<div class="notification-item">No low stock items!</div>';
        return;
    }

    // Title for the section
    const title = document.createElement('h2');
    title.textContent = 'Order New Items';
    notificationList.appendChild(title);

    // Card/list style for each item
    lowStockItems.forEach((item, idx) => {
        const maxQ = parseInt(item.max_quantity, 10);
        const q = parseInt(item.quantity, 10);

        const card = document.createElement('div');
        card.className = 'notification-card';
        card.innerHTML = `
            <span class="red-dot"></span>
            <div class="notification-content">
                <div class="item-name"><b>${item.name}</b></div>
                <div class="item-status">Low Stock - ${q}/${maxQ}</div>
            </div>
        `;
        notificationList.appendChild(card);

        // Add a horizontal line except after the last item
        if (idx < lowStockItems.length - 1) {
            const hr = document.createElement('hr');
            hr.className = 'notification-divider';
            notificationList.appendChild(hr);
        }
    });
}
