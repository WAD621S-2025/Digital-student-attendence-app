<?php
include 'db_connect.php';

$username = $_POST['signupName'];
$email = $_POST['signupEmail'];
$password = $_POST['signupPassword'];
$role = $_POST['signupRole'];


$checkUserQuery = "SELECT * FROM login WHERE email='$email' AND user_type='$role'";
$result = $connection->query($checkUserQuery);


    if ($result->num_rows > 0) {
    echo "<script>alert('User already exists!'); window.location.href='login.html';</script>";
    } else {
    
    $insertQuery = "INSERT INTO login (email, password, user_type) VALUES ('$email', '$password', '$role')";
    if ($connection->query($insertQuery) === TRUE) {

         $name_parts = explode(" ", $username);
         $lecturer_name = $name_parts[0];
         $lecturer_surname = implode(" ", array_slice($name_parts, 1));

    if ($role == 'teacher') {
   
         $insertQuery1 = "INSERT INTO lecturers (lecturer_name, lecturer_surname, email) VALUES ('$lecturer_name', '$lecturer_surname', '$email')";
         $connection->query($insertQuery1);
    
       } elseif ($role == 'student') {
      
        $name_parts = explode(" ", $username);
        $student_name = $name_parts[0];
        $student_surname = implode(" ", array_slice($name_parts, 1));
        preg_match('/\d{9}/', $email, $matches);
        $student_number = $matches[0] ?? '';
    
        $insertQuery2 = "INSERT INTO students (student_number, student_name, student_surname, email) VALUES ('$student_number', '$student_name', '$student_surname', '$email')";
        $connection->query($insertQuery2);
    }

        echo "<script>alert('Sign up successful! You can now log in.'); window.location.href='login.html';</script>";
    } else {
        echo "<script>alert('An error occured!'); window.location.href='login.html';</script>";
    }

    }
   $connection->close();

?>