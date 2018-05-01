<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/employee.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve employee data by instantiate the employee.
$employee = new Employee($db);

//Search
$stmt = $employee->getRoles();
$rowCount = $stmt->rowCount();

if($rowCount > 0)
{
    $roles_arr = array();
    $roles_arr["role"] = array();

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $role_arr = array(
          "RoleID" => $row['RoleID'],
          "Name" => $row['Name']
      );

      array_push($roles_arr["role"], $role_arr);
    }

  print_r(json_encode($roles_arr));
}
?>

