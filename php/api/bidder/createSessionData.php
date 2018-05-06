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

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  if(isset($data->BidderID) and !is_null($data->BidderID))
  {
    $BidderID = $data->BidderID;

    $SessionData = "";
    if(isset($data->SessionData) and !is_null($data->SessionData))
      $SessionData = $data->SessionData;
    
    if(!$bidder->SessionDataExists($BidderID))
    {
      if($bidder->createSessionData($BidderID, $SessionData))
      {
        echo '{';
        echo ' "message" : "Created new SessionData record."';
        echo ' ,"BidderID" : "' . $BidderID . '"';
        //echo ' ,"SessionData" : "' . $SessionData . '"';
        echo '}';
      }
      else
      {
        echo '{';
        echo ' "message" : "Failed to add SessionData record."';
        echo ' ,"BidderID" : "' . $BidderID . '"';
        //echo ' ,"SessionData" : "' . $SessionData . '"';
        echo '}';
      }
    }
    else
    {
      if($bidder->updateSessionData($BidderID, $SessionData))
      {
        echo '{';
        echo ' "message" : "Updating existing SessionData record."';
        echo ' ,"BidderID" : "' . $BidderID . '"';
        //echo ' ,"SessionData" : "' . $SessionData . '"';
        echo '}';        
      }
      else
      {
        echo '{';
        echo ' "message" : "Failed to update existing SessionData record."';
        echo ' ,"BidderID" : "' . $BidderID . '"';
       // echo ' ,"SessionData" : "' . $SessionData . '"';
        echo '}';        
      }
    }
  }
  else
  {
    echo '{';
    echo ' "message" : "Failed to create SessionData record.  Please make sure you provide a BidderID and SessionData."';
    echo '}';
  }
}
else
// get bidderID from POST
{
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["bidderid"]))
  {
    $BidderID = $_POST_LowerCase["bidderid"];

    $SessionData = "";
    if(isSet($_POST_LowerCase["sessiondata"]))
      $SessionData = $_POST_LowerCase["sessiondata"];

    if(!$bidder->SessionDataExists($BidderID))
    {
      if($bidder->createSessionData($BidderID, $SessionData))
      {
        echo '{';
        echo ' "message" : "Created new SessionData record."';
        echo ' ,"BidderID" : "' . $BidderID . '"';
        //echo ' ,"SessionData" : "' . $SessionData . '"';
        echo '}';
      }
      else
      {
        echo '{';
        echo ' "message" : "Failed to add SessionData record."';
        echo ' ,"BidderID" : "' . $BidderID . '"';
        //echo ' ,"SessionData" : "' . $SessionData . '"';
        echo '}';
      }
    }
    else
    {
      if($bidder->updateSessionData($BidderID, $SessionData))
      {
        echo '{';
        echo ' "message" : "Updating existing SessionData record."';
        echo ' ,"BidderID" : "' . $BidderID . '"';
        //echo ' ,"SessionData" : "' . $SessionData . '"';
        echo '}';        
      }
      else
      {
        echo '{';
        echo ' "message" : "Failed to update existing SessionData record."';
        echo ' ,"BidderID" : "' . $BidderID . '"';
        //echo ' ,"SessionData" : "' . $SessionData . '"';
        echo '}';        
      }
    }
  }
  else
  { 
    echo '{';
    echo ' "message" : "Failed to create SessionData record.  Please make sure you provide a BidderID and SessionData."';
    echo '}';
  }
}
?>

