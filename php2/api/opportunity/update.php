<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/opportunity.php';

date_default_timezone_set('America/Tijuana');

$database = new Database();
$db = $database->Connect();

// prepare to retrieve opportunity data by instantiate the opportunity.
$opportunity = new Opportunity($db);

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  $opportunity->OpportunityID = $data->OpportunityID;

  $ClosingDate = htmlspecialchars(strip_tags($data->ClosingDate));
  $date = new DateTime($ClosingDate);
  $opportunity->ClosingDate = $date->format('Y-m-d H:i:s');
  $opportunity->LeadEvaluatorID = $data->LeadEvaluatorID;
  $opportunity->Name = $data->Name;
  $opportunity->LowestBid = $data->LowestBid;
  $opportunity->Description = $data->Description;
  $opportunity->Status = $data->Status;

  if($opportunity->update())
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
// get opportunityID from POST
else 
{
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["opportunityid"]))
  {
    $opportunityID = $_POST_LowerCase["opportunityid"];

    //Search
    $opportunity->selectByID($opportunityID);

    if(isSet($_POST_LowerCase["closingdate"]))
    {
      $ClosingDate = $_POST_LowerCase["closingdate"];
      $ClosingDate = htmlspecialchars(strip_tags($ClosingDate));
      $date = new DateTime($ClosingDate);
      $opportunity->ClosingDate = $date->format('Y-m-d H:i:s');
    }

    //if(isSet($_POST_LowerCase["scoringcategoryblob"]))
    //{
    //  $ScoringCategoryBlob = $_POST_LowerCase["scoringcategoryblob"];
    //  $ScoringCategoryBlob = htmlspecialchars(strip_tags($ScoringCategoryBlob));
    //  $opportunity->ScoringCategoryBlob = $ScoringCategoryBlob;
    //}

    if(isSet($_POST_LowerCase["leadevaluatorid"]))
    {
      $LeadEvaluatorID = $_POST_LowerCase["leadevaluatorid"];
      $LeadEvaluatorID = htmlspecialchars(strip_tags($LeadEvaluatorID));
      $opportunity->LeadEvaluatorID = $LeadEvaluatorID;
    }

    if(isSet($_POST_LowerCase["name"]))
    {
      $Name = $_POST_LowerCase["name"];
      $Name = htmlspecialchars(strip_tags($Name));
      $opportunity->Name = $Name;
    }

    if(isSet($_POST_LowerCase["lowestbid"]))
    {
      $LowestBid = $_POST_LowerCase["lowestbid"];
      $LowestBid = htmlspecialchars(strip_tags($LowestBid));
      $opportunity->LowestBid = $LowestBid;
    }

    if(isSet($_POST_LowerCase["description"]))
    {
      $Description = $_POST_LowerCase["description"];
      $Description = htmlspecialchars(strip_tags($Description));
      $opportunity->Description = $Description;
    }

    if(isSet($_POST_LowerCase["status"]))
    {
      $Status = $_POST_LowerCase["status"];
      $Status = htmlspecialchars(strip_tags($Status));
      $opportunity->Status = $Status;
    }

    if($opportunity->update())
    {  
      echo '{';
      echo ' message : "Update suceeded. (' .$opportunityID.')"';
      echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Update failed.  (' .$opportunityID.')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "opportunity not found.  Parameter OpportunityID is Missing. "';
    echo '}';
  }
}
?>

