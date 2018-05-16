<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

date_default_timezone_set('America/Tijuana');

include_once '../config/Database.php';
include_once '../objects/proposal.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve proposal data by instantiate the proposal.
$proposal = new Proposal($db);

// get proposalID from POST
//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE && ($data !== null))
{
  $ProposalID = $data->ProposalID;
  $proposal->selectByID($ProposalID);

  $result = '';

  if(isset($proposal->OpportunityID) and !is_null($proposal->OpportunityID))
  {
    $OpportunityID = $proposal->OpportunityID;
    $MinScore = $proposal->getMinumumOppScore($OpportunityID);

    if(isset($proposal->TechnicalScore) and !is_null($proposal->TechnicalScore))
    {
      $TechnicalScore = $proposal->TechnicalScore;
      
      if($TechnicalScore < $MinScore)
      {
        $result = '{ "result" : "Evaluation 2 Rejected" }';
        $proposal->Status = 60; // Evaluation 2 Rejected  
      }
      else
      {
        $result = '{ "result" : "Evaluation 2 Accepted" }';
        $proposal->Status = 65; // Evaluation 2 Accepted        
      }
      $proposal->update();
    }
    else
    {
      $result = '{ "result" : "Technical Score not found or set." }';
    }
  }
  else
  {
    $result = '{ "result" : "OpportunityID not found or set." }';
  }

  // make it json format
  echo $result;
}
else
{
  $result = '';

  $_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["proposalid"]) 
  || isSet($_GET_LowerCase["proposalid"]))
  {
    $ProposalID = isSet($_GET_LowerCase["proposalid"]) ?
       $_GET_LowerCase["proposalid"] : $_POST_LowerCase["proposalid"];

    $proposal->selectByID($ProposalID);

    if(isset($proposal->OpportunityID) and !is_null($proposal->OpportunityID))
    {
      $OpportunityID = $proposal->OpportunityID;
      $MinScore = $proposal->getMinumumOppScore($OpportunityID);

      if(isset($proposal->TechnicalScore) and !is_null($proposal->TechnicalScore))
      {
        $TechnicalScore = $proposal->TechnicalScore;
      
        if($TechnicalScore < $MinScore)
        {
          $result = '{ "result" : "Evaluation 2 Rejected" }';
          $proposal->Status = 60; // Evaluation 2 Rejected        
        }
        else
        {
          $result = '{ "result" : "Evaluation 2 Accepted" }';
          $proposal->Status = 65; // Evaluation 2 Accepted        
        }
        $proposal->update();
      }
      else
      {
        $result = '{ "result" : "Technical Score not found or set." }';
      }
    }
    else
    {
      $result = '{ "result" : "OpportunityID not found or set." }';
    }
  }
  else
  {
    $result = '{ "result" : "ProposalID is missing." }';
  }

  // make it json format
  echo $result;
}
?>

