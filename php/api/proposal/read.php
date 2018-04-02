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

// prepare to retrieve proposal data by instantiate the proposal.
$proposal = new Proposal($db);

// get proposalID from POST
$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["proposalid"])
|| isSet($_GET_LowerCase["proposalid"]))
{
  //$proposalID = $_POST_LowerCase["proposalid"];
  $proposalID = isSet($_GET_LowerCase["proposalid"]) ?
     $_GET_LowerCase["proposalid"] : $_POST_LowerCase["proposalid"];


//  echo '{';
//  echo ' message : "ProposalID.  Record(ProposalID='.$proposalID.')"';
//  echo '}';


  //Search
  $proposal->selectByID($proposalID);

  $proposal_arr = array(
    "ProposalID" =>  $proposal->ProposalID,
    "OpportunityID" =>  $proposal->OpportunityID,
    "BidderID" =>  $proposal->BidderID,
    "Status" =>  $proposal->Status,
    "TechnicalScore" =>  $proposal->TechnicalScore,
    "FeeScore" =>  $proposal->FeeScore,
    "FinalTotalScore" =>  $proposal->FinalTotalScore
  );

  // make it json format
  print_r(json_encode($proposal_arr));
}
else
{
  //Search
  $stmt = $proposal->selectAll();
  $rowCount = $stmt->rowCount();

  $proposals_arr = array();
  $proposals_arr["proposal"] = array();

  if($rowCount > 0)
  {

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $proposal_arr = array(
        "OpportunityID" =>  $row['OpportunityID'],
        "BidderID" =>  $row['BidderID'],
        "Status" =>  $row['Status'],
        "TechnicalScore" =>  $row['TechnicalScore'],
        "FeeScore" =>  $row['FeeScore'],
        "FinalTotalScore" =>  $row['FinalTotalScore']
        );

      array_push($proposals_arr["proposal"], $proposal_arr);
    }
  }

  // make it json format
  print_r(json_encode($proposals_arr));

  //echo '{';
  //echo ' "message" : "Read Succeeded."';
  //echo '}';

}

?>
