<?php
require "../commons/database.php";
$input = json_decode(file_get_contents('php://input'), true);

$userName = $input["data"]["name"];
$userMobileNumber = $input["data"]["mobile"];
$userEmail = $input["data"]["email"];
$userPassword = md5($input["data"]["password"]);

$sql = "SELECT count(*) as count FROM `users` WHERE `email` LIKE '" . $userEmail . "' OR `mobilenumber` = '" . $userMobileNumber . "'";
$result = $conn->query($sql);
$records = $result->fetch_assoc();
if ($records['count'] > 0) {
      $response["message"] = "Email / Mobile already in use.";
} else {
      // Insert data into database
      $sql = ("INSERT INTO `users`(`name`, `mobilenumber`, `email`, `password`) VALUES ('" . $userName . "','" . $userMobileNumber . "','" . $userEmail . "','" . $userPassword . "')");
      if ($conn->query($sql)) {
            $response["code"] = 0;
            $response["message"] = "User registered successfully.";
      } else {
            $response["message"] = "Error: " . $conn->error;
      }
}

$conn->close();
echo json_encode($response);
