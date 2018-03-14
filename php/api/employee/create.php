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
  $employee->id = $data->id;
  $employee->first_name =$data->first_name;
  $employee->last_name = $data->last_name;
  $employee->email = $data->email;
  $employee->password = $data->password;
  $employee->phone = $data->phone;
  $employee->middle_init = $data->middle_init;
  $employee->address = $data->address;
  $employee->user_name = $data->user_name;  

  if($employee->create())
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

    if(isSet($_POST_LowerCase["last_name"]))
    {
      $last_name = $_POST_LowerCase["last_name"];
      $last_name = htmlspecialchars(strip_tags($last_name));
      $employee->last_name = $last_name;
    }

    if(isSet($_POST_LowerCase["email"]))
    {
      $email = $_POST_LowerCase["email"];
      $email = htmlspecialchars(strip_tags($email));
      $employee->email = $email;
    }

    if(isSet($_POST_LowerCase["password"]))
    {
      $password = $_POST_LowerCase["password"];
      $password = htmlspecialchars(strip_tags($password));
      $employee->password = $password;
    }

    if(isSet($_POST_LowerCase["phone"]))
    {
      $phone = $_POST_LowerCase["phone"];
      $phone = htmlspecialchars(strip_tags($phone));
      $employee->phone = $phone;
    }

    if(isSet($_POST_LowerCase["middle_init"]))
    {
      $middle_init = $_POST_LowerCase["middle_init"];
      $middle_init = htmlspecialchars(strip_tags($middle_init));
      $employee->middle_init = $middle_init;
    }

    if(isSet($_POST_LowerCase["address"]))
    {
      $address = $_POST_LowerCase["address"];
      $address = htmlspecialchars(strip_tags($address));
      $employee->address = $address;
    }

    if(isSet($_POST_LowerCase["user_name"]))
    {
      $user_name = $_POST_LowerCase["user_name"];
      $user_name = htmlspecialchars(strip_tags($user_name));
      $employee->user_name = $user_name;
    }

    if($employee->create())
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

