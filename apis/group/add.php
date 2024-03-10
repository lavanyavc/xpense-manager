<?php
require "../commons/database.php";
require "../commons/jwt.php";

$input = json_decode(file_get_contents('php://input'), true);
$name = $input["data"]["groupName"];
$description = $input["data"]["groupDescription"];
$auth = $input["authorization"];
$tokenData = JWT::decode($auth);
if ($tokenData == false) {
      $response['message'] = "Auth Error : Action not allowed";
      die(json_encode($response));
}
$owner = $tokenData['data']['id'];

// Insert data into database
$sql = "INSERT INTO groups(`name`,`description`,`owner`) VALUES('" . $name . "','" . $description . "','" . $owner . "')";
if ($conn->query($sql)) {
      $response["code"] = 0;
      $response["message"] = "Group created successfully.";
} else {
      $response["message"] = "Error: " . $conn->error;
}
echo json_encode($response);
if ($conn) {
      $conn->close();
}
