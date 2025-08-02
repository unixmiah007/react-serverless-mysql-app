<?php
// Set headers for CORS and JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

header("Access-Control-Allow-Origin: http://localhost:33351"); // or "*" to allow all origins
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


// Database credentials
$host = 'localhost';
$db   = 'react_app_db';
$user = 'root';
$pass = 'drupal';

// Create DB connection
$conn = new mysqli($host, $user, $pass, $db);

// Check DB connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Read and decode incoming JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
// if (!isset($data['firstname'], $data['lastname'], $data['email'], $data['username'])) {
//     http_response_code(400);
//     echo json_encode(["status" => "error", "message" => "Missing required fields."]);
//     exit;
// }

// Sanitize input
$firstname = $conn->real_escape_string($data['firstname']);
$lastname  = $conn->real_escape_string($data['lastname']);
$email     = $conn->real_escape_string($data['email']);
$username  = $conn->real_escape_string($data['username']);

// Insert into database
$sql = "INSERT INTO users (firstname, lastname, email, username) VALUES ('$firstname', '$lastname', '$email', '$username')";

if ($conn->query($sql) === TRUE) {
    // Prepare email
    $to = $email;
    $subject = "Welcome, $firstname!";
    $message = "Hi $firstname $lastname,\n\nThank you for registering.\nYour username is: $username\n\nBest regards,\nThe Team";
    $headers = "From: noreply@yourdomain.com\r\n";

    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["status" => "success", "message" => "User registered and email sent."]);
    } else {
        echo json_encode(["status" => "warning", "message" => "User registered, but email failed to send."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database insert failed: " . $conn->error]);
}

$conn->close();
?>
