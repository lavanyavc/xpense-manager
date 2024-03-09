<?php
require "../commons/database.php";
$input = json_decode($_GET["request"],true);
$groupID= $input["data"]["groupID"]; 
$userID = $input["data"]["userID"];

// $groupID = $_GET["groupID"];
// $userID=$_GET["userID"];
// if(empty($groupID,$userID)){
//       die(json_encode($response));
// }

$sql = "INSERT INTO users_groups(`user_id`,`group_id`) VALUES('".$userID."','".$groupID."')";
// $sql ="INSERT INTO products(`Product_ID`,`Product_Name`,`Quantity`,`Price`) VALUES(".$product_id.",'".$product_name."','".$quantity."','".$price."')";

$result = $conn->query($sql);
if(!empty($result)){
      // Response preparation
      $response['code'] = 0;
      $response['message'] = "User added successfully";
}
echo json_encode($response);
if($conn){
      $conn->close();
}
?>