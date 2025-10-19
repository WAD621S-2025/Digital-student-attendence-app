<?php
header('Content-Type: application/json; charset=utf-8');
include 'db_connect.php';

if ($connection->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $classId = $_GET['classId'] ?? '';
    
    if (empty($classId)) {
        echo json_encode(['success' => false, 'message' => 'Class ID is required']);
        exit();
    }
    
    $query = "SELECT id, session_id, class_id, class_code, student_number, first_name, last_name, status, timestamp 
              FROM attendance_logs 
              WHERE class_id = ? 
              ORDER BY timestamp DESC";
    
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $classId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $attendanceRecords = [];
    while ($row = $result->fetch_assoc()) {
        $attendanceRecords[] = [
            'id' => $row['id'],
            'sessionId' => $row['session_id'],
            'classId' => $row['class_id'],
            'classCode' => $row['class_code'],
            'studentNumber' => $row['student_number'],
            'firstName' => $row['first_name'],
            'lastName' => $row['last_name'],
            'status' => $row['status'],
            'timestamp' => $row['timestamp']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'count' => count($attendanceRecords),
        'attendance' => $attendanceRecords
    ]);
    
    $stmt->close();
    $connection->close();
    exit();
}

$studentNumber = $_POST['studentNumber'] ?? '';
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$sessionId = $_POST['sessionId'] ?? '';
$classId = $_POST['classId'] ?? '';
$classCode = $_POST['classCode'] ?? '';


if (empty($studentNumber) || empty($firstName) || empty($lastName) || empty($sessionId) || empty($classId)) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required'
    ]);
    exit();
}

$checkQuery = "SELECT id FROM attendance_logs WHERE session_id = ? AND student_number = ?";
$checkStmt = $connection->prepare($checkQuery);
$checkStmt->bind_param("ss", $sessionId, $studentNumber);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'You have already signed in for this class'
    ]);
    $checkStmt->close();
    $connection->close();
    exit();
}
$checkStmt->close();

$moduleQuery = "SELECT grace_period, start_time FROM modules WHERE id = ?";
$moduleStmt = $connection->prepare($moduleQuery);
$moduleStmt->bind_param("i", $classId);
$moduleStmt->execute();
$moduleResult = $moduleStmt->get_result();

$gracePeriod = 15;
$status = 'Present';

if ($moduleResult->num_rows > 0) {
    $module = $moduleResult->fetch_assoc();
    $gracePeriod = $module['grace_period'];
    $startTime = $module['start_time'];
    
    $currentTime = new DateTime();
    $classTime = new DateTime($startTime);
    $diff = $currentTime->getTimestamp() - $classTime->getTimestamp();
    $minutesLate = floor($diff / 60);
    
    if ($minutesLate > $gracePeriod) {
        $status = 'Late';
    }
}
$moduleStmt->close();

$timestamp = date('Y-m-d H:i:s');
$insertQuery = "INSERT INTO attendance_logs (session_id, class_id, class_code, student_number, first_name, last_name, status, timestamp) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$insertStmt = $connection->prepare($insertQuery);
$insertStmt->bind_param("sissssss", $sessionId, $classId, $classCode, $studentNumber, $firstName, $lastName, $status, $timestamp);

if ($insertStmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => "Attendance recorded successfully! Status: $status",
        'record' => [
            'sessionId' => $sessionId,
            'classId' => $classId,
            'classCode' => $classCode,
            'studentNumber' => $studentNumber,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'status' => $status,
            'timestamp' => $timestamp
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to record attendance: ' . $insertStmt->error
    ]);
}

$insertStmt->close();
$connection->close();
?>