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

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  $EID = $data->eid;
  $ProposalID =$data->proposalid;
  $Role = $data->role;

  if($employee->createEmployeeRole($EID, $ProposalID, $Role))
  {
    echo '{';
       echo ' message : "Create suceeded. "';
    echo '}';
  }
  else
  {
    echo '{';
       echo ' message : "Create failed."';
    echo '}';
  }
}
else
// get bidderID from POST
{
  $EID = $data->eid;
  $ProposalID =$data->proposalid;
  $Role = $data->role;


  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["employeeid"]))
  {
    $employeeID = $_POST_LowerCase["employeeid"];

    //Search
    $employee->id = $employeeID;

    if(isSet($_POST_LowerCase["first_name"]))
    {
      $first_name = $_POST_LowerCase["first_name"];
      $first_name = htmlspecialchars(strip_tags($first_name));
      $employee->first_name =$first_name;
    }


    if($employee->createEmployeeRole($EID, $ProposalID, $Role))
    {
      echo '{';
      echo ' message : "Create suceeded.  (EmployeeID=' . $employeeID . ')"';
      echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Create failed.  (EmployeeID=' . $employeeID . ')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "Create failed.  Parameter EmployeeID is missing."';
    echo '}';
  }
}
?>
