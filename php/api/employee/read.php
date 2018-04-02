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

// get employeeID from POST
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["employeeid"]))
{
  $employeeID = $_POST_LowerCase["employeeid"];

  //Search
  $employee->selectByID($employeeID);

  $employee_arr = array(
    "id" =>  $employee->id,
    "first_name" =>  $employee->first_name,
    "last_name" =>  $employee->last_name,
    "email" =>  $employee->email,
    //"password" =>  $employee->password,
    "phone" =>  $employee->phone,
    "middle_init" => $employee->middle_init,
    "address" => $employee->address,
    "user_name" => $employee->user_name
  );

  // make it json format
  print_r(json_encode($employee_arr));
}
else
{
  //Search
  $stmt = $employee->selectAll();
  $rowCount = $stmt->rowCount();

  if($rowCount > 0)
  {
    $employees_arr = array();
    $employees_arr["employee"] = array();

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $employee_arr = array(
          "id" => $row['id'],
          "first_name" => $row['first_name'],
          "last_name" => $row['last_name'],
          "email" => $row['email'],
          //"password" => $row['password'],
          "phone" => $row['phone'],
          "middle_init" => $row['middleinitial'],
          "address" => $row['address'],
          "user_name" => $row['username']
      );

      array_push($employees_arr["employee"], $employee_arr);
    }
  }
  // make it json format
  print_r(json_encode($employees_arr));
}
?>
