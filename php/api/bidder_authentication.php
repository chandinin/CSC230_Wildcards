<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once 'config/Database.php';

// get database connection
$database = new Database();
$conn = $database->Connect();


// Credentials to check from POST
$UserName = $_POST["UserName"];
$PASSWORD = $_POST["PASSWORD"];

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
    "authenticated" =>  $row["PASSWORD"] == $PASSWORD
);


print_r(json_encode($resp));

$conn->close();
?>

