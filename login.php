<?php
include 'db_connect.php';

$email = $_POST['loginEmail'];
$password = $_POST['loginPassword'];

$checkUserQuery = "SELECT * FROM users WHERE email='$email' AND password='$password'";
$result = $connection->query($checkUserQuery);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if ($user['password'] === $password && $user['email'] === $email) {
        if($user['role'] === 'lecturer'){
            echo "<script>alert('Login successful!'); window.location.href='lecturer-dashboard.html';</script>";
        } elseif($user['role'] === 'student'){
            echo "<script>alert('Login successful!'); window.location.href='student-dashboard.html';</script>";
        } 
        }
    } else {
    echo "<script>alert('Invalid email or password!'); window.location.href='login.html';</script>";
    }   
    
?>