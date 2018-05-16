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

// prepare to retrieve bidder data by instantiate the Bidder.
$opportunity = new Opportunity($db);

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{

  $opportunity->OpportunityID = $data->OpportunityID;

  if(isset($data->ClosingDate) and !is_null($data->ClosingDate))
  {
<<<<<<< HEAD
    $ClosingDate = htmlspecialchars(strip_tags($data->ClosingDate));
=======
    $ClosingDate = $data->ClosingDate;
>>>>>>> c8ecde4793884de43a1268b5eea9b9b689a0ac8e
    $date = new DateTime($ClosingDate);
    $opportunity->ClosingDate = $date->format('Y-m-d H:i:s');
  }

  if(isset($data->LeadEvaluatorID) and !is_null($data->LeadEvaluatorID))
    $opportunity->LeadEvaluatorID = $data->LeadEvaluatorID;
  if(isset($data->Name) and !is_null($data->Name))
    $opportunity->Name = $data->Name;
  if(isset($data->LowestBid) and !is_null($data->LowestBid))
    $opportunity->LowestBid = $data->LowestBid;
  if(isset($data->Description) and !is_null($data->Description))
    $opportunity->Description = $data->Description;
  if(isset($data->Status) and !is_null($data->Status))
    $opportunity->Status = $data->Status;
  if(isset($data->CategoryID) and !is_null($data->CategoryID))
    $opportunity->CategoryID = $data->CategoryID;
  if(isset($data->MinimumScore) and !is_null($data->MinimumScore))
    $opportunity->MinimumScore = $data->MinimumScore;
<<<<<<< HEAD
  if(isset($data->TotalScore) and !is_null($data->TotalScore))
    $opportunity->TotalScore = $data->TotalScore;
=======

  if(isset($data->TotalScore) and !is_null($data->TotalScore))
    $opportunity->TotalScore = $data->TotalScore;
  else if(isset($data->TotalPoints) and !is_null($data->TotalPoints))
    $opportunity->TotalScore = $data->TotalPoints;
>>>>>>> c8ecde4793884de43a1268b5eea9b9b689a0ac8e

  if($opportunity->create())
  {
    //echo '{';
    //   echo ' message : "Create suceeded. "';
    //echo '}';
  }
  else
  {
    echo '{';
       echo ' message : "Create failed."';
    echo '}';
  }
}
else
{
  // get bidderID from POST
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["opportunityid"]))
  {
    $opportunityID = $_POST_LowerCase["opportunityid"];

    //Search
    $opportunity->OpportunityID = $opportunityID;

    if(isSet($_POST_LowerCase["closingdate"]))
    {
      $ClosingDate = $_POST_LowerCase["closingdate"];
      $date = new DateTime($ClosingDate);
      $opportunity->ClosingDate = $date->format('Y-m-d H:i:s');
    }

    if(isSet($_POST_LowerCase["leadevaluatorid"]))
    {
      $LeadEvaluatorID = $_POST_LowerCase["leadevaluatorid"];
      $opportunity->LeadEvaluatorID = $LeadEvaluatorID;
    }

    if(isSet($_POST_LowerCase["name"]))
    {
      $Name = $_POST_LowerCase["name"];
      //$Name = htmlspecialchars(strip_tags($Name));
      $opportunity->Name = $Name;
    }

    if(isSet($_POST_LowerCase["lowestbid"]))
    {
      $LowestBid = $_POST_LowerCase["lowestbid"];
      $opportunity->LowestBid = $LowestBid;
    }

    if(isSet($_POST_LowerCase["description"]))
    {
      $Description = $_POST_LowerCase["description"];
      $opportunity->Description = $Description;
    }

    if(isSet($_POST_LowerCase["status"]))
    {
      $Status = $_POST_LowerCase["status"];
      $opportunity->Status = $Status;
    }

    if(isSet($_POST_LowerCase["categoryid"]))
    {
      $CategoryID = $_POST_LowerCase["categoryid"];
      $opportunity->CategoryID = $CategoryID;
    }

    if(isSet($_POST_LowerCase["minimumscore"]))
    {
      $MinimumScore = $_POST_LowerCase["minimumscore"];
<<<<<<< HEAD
      $MinimumScore = htmlspecialchars(strip_tags($MinimumScore));
=======
>>>>>>> c8ecde4793884de43a1268b5eea9b9b689a0ac8e
      $opportunity->MinimumScore = $MinimumScore;
    }

    if(isSet($_POST_LowerCase["totalscore"]))
    {
      $TotalScore = $_POST_LowerCase["totalscore"];
<<<<<<< HEAD
      $TotalScore = htmlspecialchars(strip_tags($TotalScore));
=======
      $opportunity->TotalScore = $TotalScore;
    }

    if(isSet($_POST_LowerCase["TotalPoints"]))
    {
      $TotalScore = $_POST_LowerCase["TotalPoints"];
>>>>>>> c8ecde4793884de43a1268b5eea9b9b689a0ac8e
      $opportunity->TotalScore = $TotalScore;
    }

    if($opportunity->create())
    {
      //echo '{';
      //echo ' message : "Create suceeded.  Record(OpportunityID='.$opportunityID.')"';
      //echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Create failed.  Record(OpportunityID='.$opportunityID.')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "Create failed.  Parameter Missing (OpportunityID)."';
    echo '}';
  }
}
?>

