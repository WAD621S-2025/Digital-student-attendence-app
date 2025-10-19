<?php
include 'db_connect.php';

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$moduleName = $_POST['className'];
$moduleCode = $_POST['moduleCode'];
$time = $_POST['time'];
$venue = $_POST['venue'];
$gracePeriod = $_POST['gracePeriod'];

if (empty($moduleName) || empty($moduleCode) || empty($time) || empty($venue) || empty($gracePeriod)) {
    die("All fields are required");
}

$insertQuery = "INSERT INTO modules (module_code, module_name, venue, start_time, grace_period) VALUES ('$moduleCode', '$moduleName', '$venue', '$time', '$gracePeriod')";


if ($connection->query($insertQuery) === TRUE) {
    echo "success";
} else {
    echo "Error: " . $connection->error;
}
?>