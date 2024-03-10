<?php
require "../commons/database.php";

$groupID = $_GET["id"];
if (empty($groupID)) {
      die(json_encode($response));
}

$sql = "SELECT `groups`.`id`, `groups`.`name` as groupName, `groups`.`description`, `groups`.`created_on`, `users`.`name` as ownerName FROM `groups` JOIN `users` ON `groups`.`owner`=`users`.`id` WHERE `groups`.id = " . $groupID . " LIMIT 1";
$result = $conn->query($sql);

if (!empty($result)) {
      // Group Data
      $data = array(
            "group" => $result->fetch_assoc()
      );

      // Member Data
      $sql = "SELECT `users`.`name` FROM `users`, `groups_users` WHERE `groups_users`.`user_id` = `users`.`id` AND `groups_users`.`group_id` =  " . $groupID . " ORDER BY `groups_users`.`created_on` DESC";
      $result = $conn->query($sql);
      $latest = $result->fetch_assoc();
      $data["members"] = array(
            "count" => $result->num_rows,
            "latest" => $latest['name']
      );

      // Expense Data
      $month = 1000;
      $year = 12000;
      $total = 24000;
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
if ($conn) {
      $conn->close();
}
