<?php
include 'db_connect.php';

if (!isset($_POST['studentNumber']) || empty($_POST['studentNumber'])) {
    echo json_encode(['valid' => false, 'message' => 'Student number is required']);
    exit();
}

$studentNumber = $_POST['studentNumber'];

$query = "SELECT id FROM users WHERE id AND role = 'student'";
$stmt = $connection->prepare($query);
$stmt->bind_param("s", $studentNumber);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();
    echo json_encode([
        'valid' => true,
        'message' => 'Student validated successfully',
        'student' => [
            'id' => $studentNumber
            
        ]
    ]);
} else {
    echo json_encode([
        'valid' => false, 
        'message' => 'Invalid student number'
    ]);
}

$stmt->close();
$connection->close();
?>