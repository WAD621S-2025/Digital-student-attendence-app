<?php
include 'db_connect.php';

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$moduleName = $_POST['className'] ?? '';
$moduleCode = $_POST['classCode'] ?? '';
$time = $_POST['classTime'] ?? '';
$venue = $_POST['classVenue'] ?? '';
$gracePeriod = $_POST['gracePeriod'] ?? '';

if (empty($moduleName) || empty($moduleCode) || empty($time) || empty($venue) || empty($gracePeriod)) {
    die("All fields are required");
}

$stmt = $connection->prepare("INSERT INTO modules (module_code, module_name, venue, start_time, grace_period) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssi", $moduleCode, $moduleName, $venue, $time, $gracePeriod);

if ($stmt->execute()) {
    // Return the inserted ID
    $insertedId = $connection->insert_id;
    echo json_encode(['success' => true, 'id' => $insertedId, 'message' => 'Module added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $stmt->error]);
}

$stmt->close();
$connection->close();
?>