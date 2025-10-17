<?php
include 'db_connect.php';

$email = $_POST['loginEmail'];
$password = $_POST['loginPassword'];

$checkUserQuery = "SELECT * FROM login WHERE email='$email' AND password='$password'";
$result = $connection->query($checkUserQuery);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if ($user['password'] === $password && $user['email'] === $email) {
        if($user['user_type'] === 'teacher'){
            echo "<script>alert('Login successful!'); window.location.href='teacher_dashboard.html';</script>";
        } elseif($user['user_type'] === 'student'){
            echo "<script>alert('Login successful!'); window.location.href='student_dashboard.html';</script>";
        } 
        }
    } else {
    echo "<script>alert('Invalid email or password!'); window.location.href='login.html';</script>";
    }   
    
?>