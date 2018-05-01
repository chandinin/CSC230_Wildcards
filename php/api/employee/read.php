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
if(isSet($_POST_LowerCase["employeeid"]) || isSet($_POST_LowerCase["id"]))
{
  $employeeID = $_POST_LowerCase["employeeid"];
  if(isSet($_POST_LowerCase["employeeid"]))
    $employeeID = $_POST_LowerCase["employeeid"];
  else if(isSet($_POST_LowerCase["id"]))
    $employeeID = $_POST_LowerCase["id"];

  //Search
  $employee->selectByID($employeeID);

  //Get Roles if Any
  $stmtRoles = $employee->getEmployeeRoles($employeeID);
  $roleCount = $stmtRoles->rowCount();

  $roles_arr = array();
  //$roles_arr["roles"] = array();
  if($roleCount > 0)
  {
    while($row = $stmtRoles->fetch(PDO::FETCH_ASSOC))
    {
      $role_arr = array(
          "RoleID" => $row['RoleID'],
          "Name" => $row['RoleDescription']
      );

      array_push($roles_arr, $role_arr);
    }
  }

  $employee_arr = array(
    "ID" =>  $employee->id,
    "FirstName" =>  $employee->first_name,
    "LastName" =>  $employee->last_name,
    "Email" =>  $employee->email,
    //"password" =>  $employee->password,
    "Phone" =>  $employee->phone,
    "MiddleInit" => $employee->middle_init,
    "Address" => $employee->address,
    "UserName" => $employee->user_name,
    "Roles" => $roles_arr
  );

  // make it json format
  print_r(json_encode($employee_arr));
}
else if(isSet($_POST_LowerCase["role"]))
{
  $roleID = $_POST_LowerCase["role"];

  //Search
  $stmt = $employee->selectByRole($roleID);
  $rowCount = $stmt->rowCount();

  if($rowCount > 0)
  {
    $employees_arr = array();
    $employees_arr["employee"] = array();

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $employeeID = $row['id'];

      //Get Roles if Any
      $stmtRoles = $employee->getEmployeeRoles($employeeID);
      $roleCount = $stmtRoles->rowCount();

      $roles_arr = array();
      //$roles_arr["roles"] = array();
      if($roleCount > 0)
      {
        while($rolerow = $stmtRoles->fetch(PDO::FETCH_ASSOC))
        {
          $role_arr = array(
            "RoleID" => $rolerow['RoleID'],
            "Name" => $rolerow['RoleDescription']
          );

          array_push($roles_arr, $role_arr);
        }
      }

      $employee_arr = array(
          "ID" => $row['id'],
          "FirstName" => $row['first_name'],
          "LastName" => $row['last_name'],
          "Email" => $row['email'],
          //"password" => $row['password'],
          "Phone" => $row['phone'],
          "MiddleInit" => $row['middleinitial'],
          "Address" => $row['address'],
          "UserName" => $row['username'],
          "Roles" => $roles_arr
      );

      array_push($employees_arr["employee"], $employee_arr);
    }  // end while
  } // end if
  // make it json format
  print_r(json_encode($employees_arr));
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
      $employeeID = $row['id'];

      //Get Roles if Any
      $stmtRoles = $employee->getEmployeeRoles($employeeID);
      $roleCount = $stmtRoles->rowCount();

      $roles_arr = array();
      //$roles_arr["roles"] = array();
      if($roleCount > 0)
      {
        while($rolerow = $stmtRoles->fetch(PDO::FETCH_ASSOC))
        {
          $role_arr = array(
            "RoleID" => $rolerow['RoleID'],
            "Name" => $rolerow['RoleDescription']
          );

          array_push($roles_arr, $role_arr);
        }
      }

      $employee_arr = array(
          "ID" => $row['id'],
          "FirstName" => $row['first_name'],
          "LastName" => $row['last_name'],
          "Email" => $row['email'],
          //"password" => $row['password'],
          "Phone" => $row['phone'],
          "MiddleInit" => $row['middleinitial'],
          "Address" => $row['address'],
          "UserName" => $row['username'],
          "Roles" => $roles_arr
      );

      array_push($employees_arr["employee"], $employee_arr);
    }  // end while
  } // end if
  // make it json format
  print_r(json_encode($employees_arr));
}
?>

