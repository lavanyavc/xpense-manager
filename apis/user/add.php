<?php
require "../commons/database.php";
$input = json_decode(file_get_contents('php://input'), true);
$groupID = $input["data"]["groupID"];
$userID = $input["data"]["userID"];

$sql = "SELECT count(*) as count FROM groups_users WHERE `user_id` = '" . $userID . "' AND `group_id` = '" . $groupID . "'";

$result = $conn->query($sql);
$records = $result->fetch_assoc();
if ($records['count'] > 0) {
      $response["code"] = 1;
      $response["message"] = "User already exist in this group.";
} else {
      // Insert data into database
      $sql = "INSERT INTO groups_users(`user_id`,`group_id`) VALUES('" . $userID . "','" . $groupID . "')";
      if ($conn->query($sql)) {
            $response["code"] = 0;
            $response["message"] = "User added successfully.";
      } else {
            $response["message"] = "Error: " . $conn->error;
      }
}
echo json_encode($response);
if ($conn) {
      $conn->close();
}
