<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php';


$role = $_POST['signupRole'] ?? '';
$number = $_POST['number'] ?? '';
$email = $_POST['signupEmail'] ?? '';
$password = $_POST['signupPassword'] ?? '';


if (empty($role) || empty($number) || empty($email) || empty($password)) {
    header("Location: login.html?error=signup_failed");
    exit();
}


$role = $connection->real_escape_string($role);
$number = $connection->real_escape_string($number);
$email = $connection->real_escape_string($email);
$password = $connection->real_escape_string($password);


$checkEmailQuery = "SELECT * FROM users WHERE email='$email'";
$emailResult = $connection->query($checkEmailQuery);

if ($emailResult->num_rows > 0) {
    header("Location: login.html?error=email_exists");
    exit();
}

$checkNumberQuery = "SELECT * FROM users WHERE id='$number'";
$numberResult = $connection->query($checkNumberQuery);

if ($numberResult->num_rows > 0) {
    header("Location: login.html?error=number_exists");
    exit();
}

$insertQuery = "INSERT INTO users (role, id, email, password) VALUES ('$role', '$number', '$email', '$password')";

if ($connection->query($insertQuery) === TRUE) {
   
    header("Location: login.html?success=registered");
    exit();
} else {
   
    header("Location: login.html?error=signup_failed");
    exit();
}
?>