<?php
require "../commons/database.php";
$input = json_decode($_GET["request"],true);

$searchKey=$input["data"]["searchKey"];
$currentPage=$input["pagination"]["currentPage"];
$pageSize=$input["pagination"]["pageSize"];
$sortBy=$input["pagination"]["sortBy"];
$sortOrder=$input["pagination"]["sortOrder"];

$startIndex=($currentPage-1)*$pageSize;
$where=empty($searchKey)?$searchKey:" WHERE `name` LIKE '".$searchKey."%' OR `email` LIKE '".$searchKey."%' ";

$sql = "SELECT `id`,`name`,`email` FROM `users` ".$where." ORDER BY $sortBy $sortOrder LIMIT $startIndex, $pageSize";
$result = $conn->query($sql);
if(!empty($result)){
      $response['code'] = 0;
      $response['message'] = "Success";
      $data=array();
      while($row=$result->fetch_assoc()){
            $data[]=$row;
      }
      $response["data"]= $data;
}
echo json_encode($response);
if($conn){
      $conn->close();
}
?>