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

// prepare to retrieve proposal data by instantiate the proposal.
$clarification = new Clarification($db);

// get proposalID from POST
$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["proposalid"]) 
  || isSet($_GET_LowerCase["proposalid"]))
{
  $ProposalID = isSet($_GET_LowerCase["proposalid"]) ?
     $_GET_LowerCase["proposalid"] : $_POST_LowerCase["proposalid"];

  //Search
  $stmt = $clarification->selectByProposalID($ProposalID);
  $rowCount = $stmt->rowCount();

  $clarifications_arr = array();
  $clarifications_arr["clarification"] = array();

  if($rowCount > 0)
  {
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $clarification_arr = array(
        "ClarificationID" =>  $row['ClarificationID'],
        "ProposalID" =>  $row['ProposalID'],
        "DocID" =>  $row['DocID'],
        "question" =>  $row['question'],
        "answer" =>  $row['answer'],
        "ClosingDate" =>  $row['ClosingDate'],
        "CreatedDate" =>  $row['CreatedDate'],
        "LastEditDate" =>  $row['LastEditDate']
        );

      array_push($clarifications_arr["clarification"], $clarification_arr);
    }
  }

  // make it json format
  print_r(json_encode($clarifications_arr));
}
else
{
  //Search
  $stmt = $clarification->selectAll();
  $rowCount = $stmt->rowCount();

  $clarifications_arr = array();
  $clarifications_arr["clarification"] = array();

  if($rowCount > 0)
  {
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $clarification_arr = array(
        "ClarificationID" =>  $row['ClarificationID'],
        "ProposalID" =>  $row['ProposalID'],
        "DocID" =>  $row['DocID'],
        "question" =>  $row['question'],
        "answer" =>  $row['answer'],
        "ClosingDate" =>  $row['ClosingDate'],
        "CreatedDate" =>  $row['CreatedDate'],
        "LastEditDate" =>  $row['LastEditDate']
        );

      array_push($clarifications_arr["clarification"], $clarification_arr);
    }
  }

  // make it json format
  print_r(json_encode($clarifications_arr));
}

?>

