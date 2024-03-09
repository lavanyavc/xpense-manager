<?php
require "../commons/database.php";

$groupID = $_GET["id"];
if(empty($groupID)){
      die(json_encode($response));
}

$sql = "SELECT `groups`.`id`,`groups`.`name` as groupName, `groups`.`description`,`groups`.`created_on`,`u1`.`name` as userName,`u2`.`name` as ownerName FROM `groups` JOIN `users` u1 ON `groups`.`created_by`=`u1`.`id` JOIN `users` u2 ON `groups`.`owner`=`u2`.id WHERE `groups`.id = " . $groupID . " LIMIT 1";
$result = $conn->query($sql);
if(!empty($result)){
      // Group Data
      $data = array(
            "group" => $result->fetch_assoc()
      );

      // Member Data
      $sql = "SELECT COUNT(*) as count FROM `users_groups` WHERE `group_id` = " . $groupID;


      $result = $conn->query($sql);
      $numOfMembers = $result->fetch_assoc();
      $latestMemberName = $data["group"]["groupName"];
      $data["members"] = array(
            "count" => $numOfMembers['count'],
            "latest" => $latestMemberName
      );

      // Expense Data
      $month=1000;
      $year=12000;
      $total=24000;
      $data["expense"] = array(
            "month" => $month,
            "year" => $year,
            "total" => $total
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