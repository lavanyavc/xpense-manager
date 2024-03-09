<?php
require "../commons/database.php";
$input = json_decode($_GET["request"],true);
$groupID= $input["data"]["groupID"]; 
$userID = $input["data"]["userID"];

$sql = "SELECT count(*) as count FROM users_groups WHERE `user_id` = '".$userID."' AND `group_id` = '".$groupID."'";

$result = $conn->query($sql);
$records = $result->fetch_assoc();
if($records['count'] > 0){
      $response["code"] = 1;
      $response["message"] = "User already exist in this group.";
} else {           
      // Insert data into database
      $sql = "INSERT INTO users_groups(`user_id`,`group_id`) VALUES('".$userID."','".$groupID."')";
      if($conn->query($sql)){
            $response["code"] = 0;
            $response["message"] = "User added successfully.";
      } else {
            $response["message"] = "Error: " . $conn->error;
      }
}
echo json_encode($response);
if($conn){
      $conn->close();
}
?>