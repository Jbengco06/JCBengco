<?php
require_once 'config.php';

// Add new item
function addItem($name, $quantity, $maxQuantity, $level, $category) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("INSERT INTO items (name, quantity, max_quantity, level, category) VALUES (?, ?, ?, ?, ?)");
        return $stmt->execute([$name, $quantity, $maxQuantity, $level, $category]);
    } catch(PDOException $e) {
        error_log("Add Item Error: " . $e->getMessage());
        return false;
    }
}

// Get all items
function getAllItems() {
    global $pdo;
    try {
        $stmt = $pdo->query("SELECT * FROM items ORDER BY name");
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        error_log("Retrieved items: " . print_r($items, true));
        return $items;
    } catch(PDOException $e) {
        error_log("Get All Items Error: " . $e->getMessage());
        return [];
    }
}

// Get single item
function getItem($id) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT * FROM items WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        error_log("Get Item Error: " . $e->getMessage());
        return null;
    }
}

// Update item
function updateItem($id, $name, $quantity, $maxQuantity, $level, $category) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("UPDATE items SET name = ?, quantity = ?, max_quantity = ?, level = ?, category = ? WHERE id = ?");
        return $stmt->execute([$name, $quantity, $maxQuantity, $level, $category, $id]);
    } catch(PDOException $e) {
        error_log("Update Item Error: " . $e->getMessage());
        return false;
    }
}

// Delete item
function deleteItem($id) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("DELETE FROM items WHERE id = ?");
        return $stmt->execute([$id]);
    } catch(PDOException $e) {
        error_log("Delete Item Error: " . $e->getMessage());
        return false;
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $response = ['success' => false, 'message' => 'Invalid action'];

    switch ($action) {
        case 'add':
            if (addItem(
                $_POST['name'],
                $_POST['quantity'],
                $_POST['maxQuantity'],
                $_POST['level'],
                $_POST['category']
            )) {
                $response = ['success' => true, 'message' => 'Item added successfully'];
            } else {
                $response = ['success' => false, 'message' => 'Failed to add item'];
            }
            break;

        case 'update':
            if (updateItem(
                $_POST['id'],
                $_POST['name'],
                $_POST['quantity'],
                $_POST['maxQuantity'],
                $_POST['level'],
                $_POST['category']
            )) {
                $response = ['success' => true, 'message' => 'Item updated successfully'];
            } else {
                $response = ['success' => false, 'message' => 'Failed to update item'];
            }
            break;

        case 'delete':
            if (deleteItem($_POST['id'])) {
                $response = ['success' => true, 'message' => 'Item deleted successfully'];
            } else {
                $response = ['success' => false, 'message' => 'Failed to delete item'];
            }
            break;

        case 'get':
            if (isset($_POST['id'])) {
                $item = getItem($_POST['id']);
                $response = ['success' => true, 'data' => $item];
            } else {
                $items = getAllItems();
                $response = ['success' => true, 'data' => $items];
            }
            break;
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?> 