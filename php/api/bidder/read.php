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
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["bidderid"]))
{
  $bidderID = $_POST_LowerCase["bidderid"];

  //Search
  $bidder->selectByBidderID($bidderID);

  $bidder_arr = array(
    "id" =>  $bidder->id,
    "bidopsid" =>  $bidder->bidopsid,
    "first_name" =>  $bidder->first_name,
    "last_name" =>  $bidder->last_name,
    "email" =>  $bidder->email,
    //"password" =>  $bidder->password,
    "phone" =>  $bidder->phone,
    "middle_init" => $bidder->middle_init,
    "address" => $bidder->address,
    "user_name" => $bidder->user_name
  );

  // make it json format
  print_r(json_encode($bidder_arr));
}
else
{
  //Search
  $stmt = $bidder->selectAll();
  $rowCount = $stmt->rowCount();

  if($rowCount > 0)
  {
    $bidders_arr = array();
    $bidders_arr["bidder"] = array();

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $bidder_arr = array(
          "id" => $row['id'],
          "bidopsid" => $row['bidopsid'],
          "first_name" => $row['first_name'],
          "last_name" => $row['last_name'],
          "email" => $row['email'],
          //"password" => $row['password'],
          "phone" => $row['phone'],
          "middle_init" => $row['middleinitial'],
          "address" => $row['address'],
          "user_name" => $row['username']
      );
     
      array_push($bidders_arr["bidder"], $bidder_arr);
    }
  }
  // make it json format
  print_r(json_encode($bidders_arr));
}
?>
