<?php
error_reporting(1);
$response = array(
      "code" => -1,
      "message" => "Operation Failed",
      "data" => array(),
      "pagination" => array(
            "totalRecords" => 0,
            "pageSize" => 10,
            "currentPage" => 1
      )
);

// Connection to database
$conn =new mysqli("localhost","root","","xpense-manager");
if($conn->connect_error){
      die(json_encode($response));
}
?>