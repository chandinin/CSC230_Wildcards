<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/opportunity.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve bidder data by instantiate the Bidder.
$opportunity = new Opportunity($db);

// get opportunityID from POST
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["opportunityid"]))
{
  $opportunityID = $_POST_LowerCase["opportunityid"];

  //Search
  $opportunity->selectByID($opportunityID);

  //delete bidder.
  if($opportunity->delete())
  {  
    echo '{';
    echo ' message : "Delete suceeded. (OpportunityID = '.$opportunityID.') "';
    echo '}';
  }
  else
  {
    echo '{';
    echo ' message : "Delete failed. (OpportunityID = '.$opportunityID.') "';
    echo '}';
  }
}
else
{
  echo '{';
  echo ' message : "Delete failed.  Parameter missing (OpportunityID)."';
  echo '}';
}
?>

