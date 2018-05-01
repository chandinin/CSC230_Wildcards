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

  //delete bidder.
  if($bidder->delete())
  {  
    echo '{';
    echo ' message : "Delete suceeded.  (Record [bidderID='.$bidderID.'] )"';
    echo '}';
  }
  else
  {
    echo '{';
    echo ' message : "Delete failed.  (Record [bidderID='.$bidderID.'] )"';
    echo '}';
  }
}
else
{
  echo '{';
  echo ' message : "Parameter Missing.  bidderID is required."';
  echo '}';
}
?>

