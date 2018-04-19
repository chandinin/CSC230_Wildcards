<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/clarification.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve bidder data by instantiate the Bidder.
$clarification = new Clarification($db);

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  //if(isset($data->ClarificationID) and !is_null($data->ClarificationID))
  //  $clarification->ClarificationID = $data->ClarificationID;

  $proposalID = $data->ProposalID;
  $ClarificationID = 0;
  $ClarificationID = $clarification->getNewID($proposalID);
  $clarification->ClarificationID = $ClarificationID;

  if(isset($data->ProposalID) and !is_null($data->ProposalID))
    $clarification->ProposalID = $data->ProposalID;
  if(isset($data->DocID) and !is_null($data->DocID))
    $clarification->DocID = $data->DocID;
  if(isset($data->question) and !is_null($data->question))
    $clarification->question = $data->question;
  if(isset($data->answer) and !is_null($data->answer))
    $clarification->answer = $data->answer;
  if(isset($data->ClosingDate) and !is_null($data->ClosingDate))
    $clarification->ClosingDate = $data->ClosingDate;

  if($clarification->create())
  {

  }
  else
  {
    echo '{';
    echo ' message : "Create failed.",';
    echo ' "ProposalID: "'.$proposalID.'",';
    echo ' "ClarificationID" : "'.$ClarificationID.'"';
    echo '}';
  }
}
else
{
  // get bidderID from POST
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["proposalid"]))
  {
    //$ClarificationID = $_POST_LowerCase["clarificationid"];

    //Search
    //$clarification->ClarificationID = $ClarificationID;

    $ProposalID = $_POST_LowerCase["proposalid"];
    $ProposalID = htmlspecialchars(strip_tags($ProposalID));
    $clarification->ProposalID = $ProposalID;

    $ClarificationID = 0;
    $ClarificationID = $clarification->getNewID($ProposalID);
    $clarification->ClarificationID = $ClarificationID;

    if(isSet($_POST_LowerCase["docid"]))
    {
      $DocID = $_POST_LowerCase["docid"];
      $DocID = htmlspecialchars(strip_tags($DocID));
      $clarification->DocID = $DocID;
    }

    if(isSet($_POST_LowerCase["question"]))
    {
      $question = $_POST_LowerCase["question"];
      $question = htmlspecialchars(strip_tags($question));
      $clarification->question = $question;
    }

    if(isSet($_POST_LowerCase["answer"]))
    {
      $answer = $_POST_LowerCase["answer"];
      $answer = htmlspecialchars(strip_tags($answer));
      $clarification->answer = $answer;
    }

    if(isSet($_POST_LowerCase["closingdate"]))
    {
      $ClosingDate = $_POST_LowerCase["closingdate"];
      $ClosingDate = htmlspecialchars(strip_tags($ClosingDate));
      $clarification->ClosingDate = $ClosingDate;
    }

    if($proposal->create())
    {

    }
    else
    {
      echo '{';
      echo ' message : "Create failed.  Record(proposalID='.$ProposalID.')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "Create failed.  Parameter Missing (ProposalID)."';
    echo '}';
  }
}
?>

