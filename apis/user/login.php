<?php
require "../commons/database.php";
require "../commons/jwt.php";

$input = json_decode(file_get_contents('php://input'), true);

$userEmail = $input["data"]["email"];
$userPassword = md5($input["data"]["password"]);

$sql = "SELECT * FROM `users` WHERE `email` LIKE '" . $userEmail . "' AND `password` = '" . $userPassword . "'";
$result = $conn->query($sql);
$records = $result->fetch_assoc();
if (isset($records['id'])) {
      switch ($records['status']) {
            case "ACTIVE":
                  $response["code"] = 0;
                  $response["message"] = "Success";
                  $tokenData = array(
                        'id' => $records['id'],
                        "name" => $records['name'],
                        "email" => $records['email']
                  );
                  $response['data'] = array(
                        "name" => $records['name'],
                        "token" => JWT::encode($tokenData)
                  );
                  break;
            case "DELETED":
                  $response["message"] = "Invalid Credentials";
                  break;
            default:
                  $response["message"] = "User is Inactive";
                  break;
      }
} else {
      $response["message"] = "Invalid Credentials";
}

$conn->close();
echo json_encode($response);
