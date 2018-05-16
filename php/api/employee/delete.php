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

// prepare to retrieve bidder data by instantiate the Bidder.
$employee = new Employee($db);

// get employeeID from POST
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["employeeid"]) || isSet($_POST_LowerCase["id"]))
{
  if(isSet($_POST_LowerCase["employeeid"]))
    $employeeID = $_POST_LowerCase["employeeid"];
  else if(isSet($_POST_LowerCase["id"]))
    $employeeID = $_POST_LowerCase["id"];

  //Search
  $employee->id = $employeeID;

  //delete bidder.
  if($employee->delete())
  {  
    $employee->removeEmployeeAllRoles($employeeID);
  }
  else
  {
    echo '{';
    echo ' message : "Delete failed.  Record(EmployeeID='.$employeeID.')"';
    echo '}';
  }
}
?>

