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

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  $proposal->ProposalID = $data->ProposalID;
  if(isset($data->OpportunityID) && !is_null($data->OpportunityID))
    $proposal->OpportunityID = $data->OpportunityID;
  if(isset($data->BidderID) && !is_null($data->BidderID))
    $proposal->BidderID = $data->BidderID;
  if(isset($data->Status) && !is_null($data->Status))
    $proposal->Status = $data->Status;
  if(isset($data->TechnicalScore) && !is_null($data->TechnicalScore))
    $proposal->TechnicalScore = $data->TechnicalScore;
  if(isset($data->FeeScore) && !is_null($data->FeeScore))
    $proposal->FeeScore = $data->FeeScore;
  if(isset($data->FinalTotalScore) && !is_null($data->FinalTotalScore))
    $proposal->FinalTotalScore = $data->FinalTotalScore;

  if($proposal->create())
  {
    echo '{';
       echo ' message : "Create suceeded. "';
    echo '}';
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
  if(isSet($_POST_LowerCase["proposalid"]))
  {
    $ProposalID = $_POST_LowerCase["proposalid"];

    //Search
    $proposal->ProposalID = $ProposalID;

    if(isSet($_POST_LowerCase["opportunityid"]))
    {
      $OpportunityID = $_POST_LowerCase["opportunityid"];
      $OpportunityID = htmlspecialchars(strip_tags($OpportunityID));
      $proposal->OpportunityID =$OpportunityID;
    }

    if(isSet($_POST_LowerCase["bidderid"]))
    {
      $BidderID = $_POST_LowerCase["bidderid"];
      $BidderID = htmlspecialchars(strip_tags($BidderID));
      $proposal->BidderID =$BidderID;
    }

    if(isSet($_POST_LowerCase["status"]))
    {
      $Status = $_POST_LowerCase["status"];
      $Status = htmlspecialchars(strip_tags($Status));
      $proposal->Status =$Status;
    }

    if(isSet($_POST_LowerCase["technicalscore"]))
    {
      $TechnicalScore = $_POST_LowerCase["technicalscore"];
      $TechnicalScore = htmlspecialchars(strip_tags($TechnicalScore));
      $proposal->TechnicalScore =$TechnicalScore;
    }

    if(isSet($_POST_LowerCase["feescore"]))
    {
      $FeeScore = $_POST_LowerCase["feescore"];
      $FeeScore = htmlspecialchars(strip_tags($FeeScore));
      $proposal->FeeScore =$FeeScore;
    }

    if(isSet($_POST_LowerCase["finaltotalscore"]))
    {
      $FinalTotalScore = $_POST_LowerCase["finaltotalscore"];
      $FinalTotalScore = htmlspecialchars(strip_tags($FinalTotalScore));
      $proposal->FinalTotalScore =$FinalTotalScore;
    }

    if($proposal->create())
    {
      echo '{';
      echo ' message : "Create suceeded.  Record(proposalID='.$ProposalID.')"';
      echo '}';
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

