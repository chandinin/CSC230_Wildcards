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

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  if(isset($data->ID) and !is_null($data->ID))
    $employee->id = $data->ID;
  else if(isset($data->EmployeeID) and !is_null($data->EmployeeID))
    $employee->id = $data->EmployeeID;

  $employeeID = $employee->id;

  if(isset($data->FirstName) and !is_null($data->FirstName))
    $employee->first_name =$data->FirstName;
  if(isset($data->LastName) and !is_null($data->LastName))
    $employee->last_name = $data->LastName;
  if(isset($data->Email) and !is_null($data->Email))
    $employee->email = $data->Email;
  if(isset($data->Password) and !is_null($data->Password))
    $employee->password = $data->Password;
  if(isset($data->Phone) and !is_null($data->Phone))
    $employee->phone = $data->Phone;
  if(isset($data->MiddleInit) and !is_null($data->MiddleInit))
    $employee->middle_init = $data->MiddleInit;
  if(isset($data->Address) and !is_null($data->Address))
    $employee->address = $data->Address;
  if(isset($data->UserName) and !is_null($data->UserName))
    $employee->user_name = $data->UserName;

  if(isset($data->Roles) and !is_null($data->Roles))
  {
    $roles = $data->Roles;
    foreach($roles as $role)
    { 
      if($employee->IsRoleExists($employeeID, $role->Role) != true)
      {         
        if($employee->createEmployeeRole($employeeID, $role->Role))
        {
       
        }
        else
        {
          echo '{';
          echo ' message : "Update failed.  Record (EmployeeID='.$employeeID.')"';
          echo ' , "message2" : "Create failed." ';
          echo ' , "Role" : "' . $role->Role . '"';
          echo '}';
        }
      }
    }
  }    


  if($employee->update())
  {  
  }
  else
  {
    echo '{';
    echo ' message : "Update failed.  Record (EmployeeID='.$employeeID.')"';
    echo $error;
    echo '}';
  }
}
// get employeeID from POST
else 
{
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["id"]))
  {
    $employeeID = $_POST_LowerCase["ID"];

    //Search
    $employee->selectByID($employeeID);

    if(isSet($_POST_LowerCase["firstname"]))
    {
      $first_name = $_POST_LowerCase["firstname"];
      $first_name = htmlspecialchars(strip_tags($first_name));
      $employee->first_name =$first_name;
    }

    if(isSet($_POST_LowerCase["lastname"]))
    {
      $last_name = $_POST_LowerCase["lastname"];
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

    if(isSet($_POST_LowerCase["middleinit"]))
    {
      $middle_init = $_POST_LowerCase["middleinit"];
      $middle_init = htmlspecialchars(strip_tags($middle_init));
      $employee->middle_init = $middle_init;
    }

    if(isSet($_POST_LowerCase["address"]))
    {
      $address = $_POST_LowerCase["address"];
      $address = htmlspecialchars(strip_tags($address));
      $employee->address = $address;
    }

    if(isSet($_POST_LowerCase["username"]))
    {
      $user_name = $_POST_LowerCase["username"];
      $user_name = htmlspecialchars(strip_tags($user_name));
      $employee->user_name = $user_name;
    }

    if($employee->update())
    {  
      //echo '{';
      //echo ' message : "Update suceeded.  Record (EmployeeID='.$employeeID.')"';
      //echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Update failed.  Record (EmployeeID='.$employeeID.')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "Update Failed.  Parameter EmployeeID is missing."';
    echo '}';
  }
}
?>

