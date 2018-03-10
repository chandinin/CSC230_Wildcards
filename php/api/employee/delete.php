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
if(isSet($_POST["employeeID"]))
{
  $employeeID = $_POST["employeeID"];

  //Search
  $employee->id = $employeeID;

  //delete bidder.
  if($employee->delete())
  {  
    echo '{';
       echo ' message : "Delete suceeded. "';
    echo '}';
  }
  else
  {
    echo '{';
       echo ' message : "Delete failed."';
    echo '}';
  }
}
?>

