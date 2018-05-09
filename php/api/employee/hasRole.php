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

$result = array("result" => "false");

$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["employeeid"]) || isSet($_POST_LowerCase["id"]))
{
  $employeeID = $_POST_LowerCase["employeeid"];
  if(isSet($_POST_LowerCase["employeeid"]))
    $employeeID = $_POST_LowerCase["employeeid"];
  else if(isSet($_POST_LowerCase["id"]))
    $employeeID = $_POST_LowerCase["id"];

  $Role = $_POST_LowerCase["role"];

  if($employee->IsRoleExists($employeeID,$Role))
  {
    $result = array("result" => "true");

    //$result = true;
    //echo '{ "result" : "true" }';    
  }
  else
  {
    //echo '{ "result" : "false" }';       
  }

  print_r(json_encode($result));
}
else
{
  echo '{';
  echo ' "Message" : "Employee not found!"';
  echo '}';       
}
?>
