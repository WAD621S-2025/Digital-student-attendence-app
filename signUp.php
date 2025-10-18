<?php
include 'db_connect.php';

$email = $_POST['signupEmail'];
$password = $_POST['signupPassword'];
$role = $_POST['signupRole'];
$student_number =$_POST['number'];


$checkUserQuery = "SELECT * FROM users WHERE email='$email' AND role='$role'";
$result = $connection->query($checkUserQuery);


    if ($result->num_rows > 0) {
    echo "<script>alert('User already exists!'); window.location.href='login.html';</script>";
    } else {
    
    $insertQuery = "INSERT INTO users (id, email, password, role ) VALUES ('$student_number', '$email', '$password', '$role')";
    if ($connection->query($insertQuery) === TRUE) {

        echo "<script>alert('Sign up successful! You can now log in.'); window.location.href='login.html';</script>";
    } else {
        echo "<script>alert('An error occured!'); window.location.href='login.html';</script>";
    }

    }
   $connection->close();

?>