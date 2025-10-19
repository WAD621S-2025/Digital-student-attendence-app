<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php';


$email = $_POST['loginEmail'] ?? '';
$password = $_POST['loginPassword'] ?? '';


if (empty($email) || empty($password)) {
    header("Location: login.html?error=invalid");
    exit();
}


$email = $connection->real_escape_string($email);


$checkUserQuery = "SELECT * FROM users WHERE email='$email' ";
$result = $connection->query($checkUserQuery);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
   
    if ($user['password'] === $password) {
        
        if($user['role'] === 'lecturer'){
            echo "<script>window.location.href='lecturer-dashboard.html';</script>";
            exit();
        } 
        elseif($user['role'] === 'student'){
            echo "<script>window.location.href='student-dashboard.html';</script>";
            exit();
        }
    }
}


header("Location: login.html?error=invalid");
exit();
?>