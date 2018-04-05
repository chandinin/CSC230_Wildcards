<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/bidder.php';

$database = new Database();
$db = $database->Connect();
 
// prepare to retrieve bidder data by instantiate the Bidder.
$bidder = new Bidder($db);

// get bidderID from POST
$bidderID = $_POST["bidderID"];

//Search
$bidder->selectByBidderID($bidderID);

$bidder_arr = array(
    "id" =>  $bidder->id,
    "bidopsid" =>  $bidder->bidopsid,
    "first_name" =>  $bidder->first_name,
    "last_name" =>  $bidder->last_name,
    "email" =>  $bidder->email,
    "password" =>  $bidder->password,
    "phone" =>  $bidder->phone
);
 
// make it json format
print_r(json_encode($bidder_arr));

?>
