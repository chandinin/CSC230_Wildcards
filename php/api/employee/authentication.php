<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

//ini_set("log_errors", 1);
//ini_set("error_log", "/tmp/php-error.log");
//error_log( "Hello, errors!" );

include_once '../config/Database.php';
include_once '../objects/employee.php';

// get database connection
$database = new Database();
$conn = $database->Connect();

$UserName = "";
$PASSWORD = "";
$Role = "";
$Method   = "";
// Credentials to check from POST

$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
    $UserName = $data->UserName;
    $PASSWORD = $data->PASSWORD;
    $Role = $data->Role;
    $Method = "JSON";
}
else
{
    $UserName = $_POST["UserName"];
    $PASSWORD = $_POST["PASSWORD"];
    $Role = $_POST["Role"];
    $Method = "Form";
}

// Query database for our user with ID
$query = "SELECT PASSWORD, FIRST_NAME, LAST_NAME, ID FROM EMPLOYEE  WHERE UserName = ?;";

// prepare query statement
$stmt = $conn->prepare($query);

// bind id of product to be updated
$stmt->bindParam(1, $UserName);

// execute query
$stmt->execute();

// get retrieved row
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$FullName = $row["FIRST_NAME"] . " " . $row["LAST_NAME"];
$EID = $row["ID"];

// instantiate the employee methods and use "IsRoleExists($EID, $Role)".
$employee = new Employee($conn);

$resp = array(
    "authenticated" =>  ($row["PASSWORD"] == $PASSWORD && $employee->IsRoleExists($EID, $Role)),
    "method" => $Method,
    "UserName" => $UserName,
    "FullName" => $FullName
);


print_r(json_encode($resp));
//$conn->close();
http_response_code(200);
?>
