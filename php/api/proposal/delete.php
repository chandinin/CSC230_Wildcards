<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/proposal.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve bidder data by instantiate the Bidder.
$proposal = new Proposal($db);

// get proposalID from POST
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["proposalid"]))
{
  $proposalID = $_POST_LowerCase["proposalid"];

  //Search
  $proposal->selectByID($proposalID);

  //delete bidder.
  if($proposal->delete())
  {  
    echo '{';
       echo ' message : "Delete suceeded. (proposalID = ' . $proposalID . ')"';
    echo '}';
  }
  else
  {
    echo '{';
       echo ' message : "Delete failed."';
    echo '}';
  }
}
?>

