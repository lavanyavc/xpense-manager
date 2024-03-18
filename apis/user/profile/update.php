<?php
require "../../commons/database.php";
require "../../commons/jwt.php";

$input = json_decode(file_get_contents('php://input'), true);
$name = $input["data"]["name"];
$newPassword = $input["data"]["newPassword"];
$password = $input["data"]["password"];

$auth = $input["authorization"];
$tokenData = JWT::decode($auth);
if ($tokenData == false) {
      $response['message'] = "Auth Error : Action not allowed";
      die(json_encode($response));
}
$id = $tokenData['data']['id'];
$toUpdate = "";
if (!empty($name)) {
      $toUpdate .= "`name`='" . $name . "',";
}
if (!empty($newPassword)) {
      $toUpdate .= "`password`='" . md5($newPassword) . "',";
}
if (strlen($toUpdate) > 0) {
      $toUpdate = substr($toUpdate, 0, strlen($toUpdate) - 1);
      // Update data into database
      $sql = "UPDATE users SET " . $toUpdate . "  WHERE `id`=" . $id . " AND `password`='" . md5($password) . "'";
      $response['sql'] = $sql;
      $result = $conn->query($sql);
      if ($conn->affected_rows == 1) {
            $response["code"] = 0;
            $response["message"] = "Profile updated successfully.";
      } else {
            $response["message"] = "Error: Invalid Password.";
      }
} else {
      $response["message"] = "No changes to update";
}
echo json_encode($response);
if ($conn) {
      $conn->close();
}
