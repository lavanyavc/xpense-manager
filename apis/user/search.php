<?php
require "../commons/database.php";
require "../commons/jwt.php";

$input = json_decode($_GET["request"], true);
$user = isset($input["data"]["user"]) ? $input["data"]["user"] : false;

$searchKey = "";
$currentPage = "1";
$pageSize = "1";
$sortBy = "id";
$sortOrder = "ASC";
$startIndex = "0";
$where = "";
if ($user == true) {
      $auth = $input["authorization"];
      $tokenData = JWT::decode($auth);
      if ($tokenData == false) {
            $response['message'] = "Auth Error : Action not allowed";
            die(json_encode($response));
      }
      $where = " WHERE `id` = " . $tokenData['data']['id'];
} else {
      $searchKey = $input["data"]["searchKey"];
      $currentPage = $input["pagination"]["currentPage"];
      $pageSize = $input["pagination"]["pageSize"];
      $sortBy = $input["pagination"]["sortBy"];
      $sortOrder = $input["pagination"]["sortOrder"];
      $startIndex = ($currentPage - 1) * $pageSize;
      $where = empty($searchKey) ? $searchKey : " WHERE `name` LIKE '" . $searchKey . "%' OR `email` LIKE '" . $searchKey . "%' ";
}

$sql = "SELECT `id` ,`name`,`email`, `mobile` FROM `users` " . $where . " ORDER BY $sortBy $sortOrder LIMIT $startIndex, $pageSize";
$result = $conn->query($sql);
if (!empty($result)) {
      $response['code'] = 0;
      $response['message'] = "Success";
      $data = array();
      while ($row = $result->fetch_assoc()) {
            $data[] = $row;
      }
      $response["data"] = $data;
}
echo json_encode($response);
if ($conn) {
      $conn->close();
}
