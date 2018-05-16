<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/bidder.php';

date_default_timezone_set('America/Tijuana');

$database = new Database();
$db = $database->Connect();

// prepare to retrieve bidder data by instantiate the Bidder.
$bidder = new Bidder($db);

// get bidderID from POST
$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["bidderid"]) || isSet($_GET_LowerCase["bidderid"]))
{
  $BidderID = (isSet($_GET_LowerCase["bidderid"]) ? $_GET_LowerCase["bidderid"] : $_POST_LowerCase["bidderid"]);

  //Search
  $stmt = ($bidder->readSessionData($BidderID));

  $rowCount = $stmt->rowCount();

  if($rowCount > 0)
  {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $bidder_arr = array(
          "BidderID" => $row['BidderID'],
          "SessionData" => $row['SessionData']
      );
     
    // make it json format
    print_r(json_encode($bidder_arr));
  }
  else
  {
    echo '{';
    echo ' "message" : "Record not found."';
    echo ' ,"BidderID" : "' . $BidderID . '"';
    echo '}';
  }
}
else
{
  echo '{';
  echo ' "message" : "Failed to retrieve SessionData.  Please provide a vailid BidderID."';
  echo '}';
}
?>

