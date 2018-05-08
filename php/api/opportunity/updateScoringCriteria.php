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

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  if(isset($data->OpportunityID) and !is_null($data->OpportunityID))
  {
    $OpportunityID = $data->OpportunityID;

    $opportunity = new Opportunity($db);
    
    $DocTitle = null;
    if(isset($data->DocTitle) and !is_null($data->DocTitle))
      $DocTitle = $data->DocTitle;

    $DisplayTitle = null;
    if(isset($data->DisplayTitle) and !is_null($data->DisplayTitle))
      $DisplayTitle = $data->DisplayTitle; 

    if($opportunity->UpdateScoringCriteria($OpportunityID, $DocTitle, $DisplayTitle))
    {  
      echo '{';
      echo ' message : "Update suceeded. "';
      echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Update failed."';
      echo '}';
    }
  }
}
// get bidderID from POST
else 
{
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["opportunityid"]))
  {
    $OpportunityID = $_POST_LowerCase["opportunityid"];

    $opportunity = new Opportunity($db);

    $DocTitle = null;
    if(isSet($_POST_LowerCase["doctitle"]))
    {
      $DocTitle = $_POST_LowerCase["doctitle"];
    }

    $DisplayTitle=null;
    if(isSet($_POST_LowerCase["displaytitle"]))
    {
      $DisplayTitle = $_POST_LowerCase["displaytitle"];
      $DisplayTitle = htmlspecialchars(strip_tags($DisplayTitle));
    }

    if($opportunity->UpdateScoringCriteria($OpportunityID, $DocTitle, $DisplayTitle))
    {  
      echo '{';
      echo ' message : "Update suceeded.  Record (OpportunityID='.$OpportunityID.')"';
      echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Update failed.  Record (OpportunityID='.$OpportunityID.')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "DocTemplate not found.  Record (OpportunityID='.$OpportunityID.')"';
    echo '}';
  }
}
?>