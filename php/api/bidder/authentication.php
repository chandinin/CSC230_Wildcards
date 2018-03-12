<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';

// get database connection
$database = new Database();
$conn = $database->Connect();

$UserName = "";
$PASSWORD = "";
$Method   = "";
// Credentials to check from POST

$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
    $UserName = $data->UserName;
    $PASSWORD = $data->PASSWORD;
    $Method = "JSON";
}
else
{
    $UserName = $_POST["UserName"];
    $PASSWORD = $_POST["PASSWORD"];
    $Method = "Form";
}

// Query database for our user with ID
$query = "SELECT PASSWORD FROM BIDDER  WHERE UserName = ?;";

// prepare query statement
$stmt = $conn->prepare($query);
 
// bind id of product to be updated
$stmt->bindParam(1, $UserName);
 
// execute query
$stmt->execute();

// get retrieved row
$row = $stmt->fetch(PDO::FETCH_ASSOC);


$resp = array(
    "authenticated" =>  $row["PASSWORD"] == $PASSWORD,
    "method" => $Method,
    "UserName" => $UserName

);


print_r(json_encode($resp));

$conn->close();
?>

