<?php
$servername = "localhost";
$username = "root";
$password = "Root@1234";
$dbname = "Attendance_db";

$connection = new mysqli($servername, $username, $password, $dbname);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

echo "Connected successfully";
?>