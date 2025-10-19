<?php
header('Content-Type: application/json; charset=utf-8');

include 'db_connect.php';

// Expecting: studentNumber, firstName, lastName, sessionId, classId, classCode
$studentNumber = $_POST['studentNumber'] ?? null;
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
session_start();
$sessionId = $_POST['sessionId'] ?? null;
$classId = $_POST['classId'] ?? null;
$classCode = $_POST['classCode'] ?? null;

if (!$studentNumber || !$sessionId || !$classId) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Determine status (on-time/late) - if a session start time and grace_period were stored server-side, we'd use them.
// For now, accept optional 'status' from client or default to 'Present'.
$status = $_POST['status'] ?? 'Present';
$timestamp = date('Y-m-d H:i:s');

try {
    $stmt = $connection->prepare("INSERT INTO attendance_logs (session_id, class_id, class_code, student_number, first_name, last_name, status, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('sissssss', $sessionId, $classId, $classCode, $studentNumber, $firstName, $lastName, $status, $timestamp);
    $ok = $stmt->execute();

    if ($ok) {
        echo json_encode(['success' => true, 'message' => 'Attendance saved', 'record' => [
            'sessionId' => $sessionId,
            'classId' => $classId,
            'classCode' => $classCode,
            'studentNumber' => $studentNumber,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'status' => $status,
            'timestamp' => $timestamp
        ]]);
    } else {
        echo json_encode(['success' => false, 'message' => 'DB insert failed', 'error' => $stmt->error]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Exception: ' . $e->getMessage()]);
}

$connection->close();
?>