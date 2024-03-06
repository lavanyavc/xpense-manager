<?php
require "database.php";

$groupID = $_GET["id"];
if(empty($groupID)){
      die(json_encode($response));
}

// $sql = "SELECT `groups`.`id`,`groups`.`name` as groupName FROM groups WHERE `groups`.id = " . $groupID . " LIMIT 1";
$sql = "SELECT `groups`.`id`,`groups`.`name` as groupName FROM groups `id` = " . $groupID;

$result = $conn->query($sql);
if(!empty($result)){
      // Group Data
      $data = array(
            "group" => $result->fetch_assoc()
      );

      // Response preparation
      $response['code'] = 0;
      $response['message'] = "Success";
      $response["data"] = $data;
}
echo json_encode($response);
if($conn){
      $conn->close();
}
?>