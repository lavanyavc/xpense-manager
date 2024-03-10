<?php
require "../commons/database.php";
require "../commons/jwt.php";

$input = json_decode(file_get_contents('php://input'), true);
$groupName = $input["data"]["groupName"];
$groupDescription = $input["data"]["groupDescription"];
$auth = $input["authorization"];
$tokenData = JWT::decode($auth);
if ($tokenData == false) {
      $response['message'] = "Auth Error : Action not allowed";
      die(json_encode($response));
}

$createdBy = $tokenData['data']['id'];

$sql = "(SELECT count(*) as count FROM groups WHERE `name` LIKE '" . $groupName . "')";

$result = $conn->query($sql);
$records = $result->fetch_assoc();
if ($records['count'] > 0) {
      $response["code"] = 1;
      $response["message"] = "Group already exists with this name.";
} else {
      // Insert data into database
      $sql = "INSERT INTO groups(`name`,`description`, `created_by`, `owner`) VALUES('" . $groupName . "','" . $groupDescription . "','" . $createdBy . "','" . $createdBy . "')";
      if ($conn->query($sql)) {
            $response["code"] = 0;
            $response["message"] = "Group created successfully.";
      } else {
            $response["message"] = "Error: " . $conn->error;
      }
}
echo json_encode($response);
if ($conn) {
      $conn->close();
}
