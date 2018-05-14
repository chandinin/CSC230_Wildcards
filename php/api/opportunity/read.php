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

// prepare to retrieve opportunity data by instantiate the opportunity.
$opportunity = new Opportunity($db);

// get opportunityID from POST
$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["opportunityid"]) 
|| isSet($_GET_LowerCase["opportunityid"]))
{
  //$opportunityID = $_POST_LowerCase["opportunityid"];
  $opportunityID = isSet($_GET_LowerCase["opportunityid"]) ? 
     $_GET_LowerCase["opportunityid"] : $_POST_LowerCase["opportunityid"];

  //Search
  $opportunity->selectByID($opportunityID);

  $ProposalCount = $opportunity->getProposalCount($opportunityID);

  $opportunity_arr = array(
    "OpportunityID" =>  $opportunity->OpportunityID,
    "ClosingDate" =>  $opportunity->ClosingDate,
    "LeadEvaluatorID" =>  $opportunity->LeadEvaluatorID,
    "Name" =>  $opportunity->Name,
    "LowestBid" =>  $opportunity->LowestBid,
    "Description" =>  $opportunity->Description,
    "Status" =>  $opportunity->Status,
    "StatusName" =>  $opportunity->StatusName,
    "CategoryID" =>  $opportunity->CategoryID,
    "CreatedDate" =>  $opportunity->CreatedDate,
    "LastEditDate" =>  $opportunity->LastEditDate,
    "ProposalCount" =>  $ProposalCount,
    "MinimumScore" =>  $opportunity->MinimumScore,
    "TotalPoints" =>  $opportunity->TotalScore
  );

  // make it json format
  print_r(trim(json_encode($opportunity_arr)));
}
else if(isSet($_POST_LowerCase["status"])
|| isSet($_GET_LowerCase["status"]))
{
  $status = isSet($_GET_LowerCase["status"]) ?
     $_GET_LowerCase["status"] : $_POST_LowerCase["status"];

  //Search
  $stmt = $opportunity->selectByStatusID($status);
  $rowCount = $stmt->rowCount();

  $opportunities_arr = array();
  $opportunities_arr["opportunity"] = array();

  if($rowCount > 0)
  {

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $opportunityID = $row['OpportunityID'];
      $ProposalCount = $opportunity->getProposalCount($opportunityID);

      $opportunity_arr = array(
          "OpportunityID" => $row['OpportunityID'],
          "ClosingDate" => $row['ClosingDate'],
          "LeadEvaluatorID" => $row['LeadEvaluatorID'],
          "Name" => $row['Name'],
          "LowestBid" => $row['LowestBid'],
          "Description" => $row['Description'],
          "Status" => $row['Status'],
          "StatusName" => $row['StatusName'],
          "CategoryID" => $row['CategoryID'],
          "CreatedDate" => $row['CreatedDate'],
          "LastEditDate" => $row['LastEditDate'],
          "ProposalCount" => $ProposalCount,
          "MinimumScore" =>  $row['MinimumScore'],
          "TotalPoints" =>  $row['TotalScore']
      );

      array_push($opportunities_arr["opportunity"], $opportunity_arr);
    }
  }

  // make it json format
  print_r(trim(json_encode($opportunities_arr)));
}
else if(isSet($_POST_LowerCase["categoryid"])
|| isSet($_GET_LowerCase["categoryid"]))
{
  //$opportunityID = $_POST_LowerCase["opportunityid"];
  $categoryid = isSet($_GET_LowerCase["categoryid"]) ?
     $_GET_LowerCase["categoryid"] : $_POST_LowerCase["categoryid"];

  //Search
  $stmt = $opportunity->selectByCategoryID($categoryid);
  $rowCount = $stmt->rowCount();

  $opportunities_arr = array();
  $opportunities_arr["opportunity"] = array();

  if($rowCount > 0)
  {

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $opportunityID = $row['OpportunityID'];
      $ProposalCount = $opportunity->getProposalCount($opportunityID);

      $opportunity_arr = array(
          "OpportunityID" => $row['OpportunityID'],
          "ClosingDate" => $row['ClosingDate'],
          "LeadEvaluatorID" => $row['LeadEvaluatorID'],
          "Name" => $row['Name'],
          "LowestBid" => $row['LowestBid'],
          "Description" => $row['Description'],
          "Status" => $row['Status'],
          "StatusName" => $row['StatusName'],
          "CategoryID" => $row['CategoryID'],
          "CreatedDate" => $row['CreatedDate'],
          "LastEditDate" => $row['LastEditDate'],
          "ProposalCount" => $ProposalCount,
          "MinimumScore" =>  $row['MinimumScore'],
          "TotalPoints" =>  $row['TotalScore']
      );

      array_push($opportunities_arr["opportunity"], $opportunity_arr);
    }
  }

  // make it json format
  print_r(trim(json_encode($opportunities_arr)));
}
else
{
  //Search
  $stmt = $opportunity->selectAll();
  $rowCount = $stmt->rowCount();

  $opportunities_arr = array();
  $opportunities_arr["opportunity"] = array();

  if($rowCount > 0)
  {

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $opportunityID = $row['OpportunityID'];
      $ProposalCount = $opportunity->getProposalCount($opportunityID);

      $opportunity_arr = array(
          "OpportunityID" => $row['OpportunityID'],
          "ClosingDate" => $row['ClosingDate'],
          "LeadEvaluatorID" => $row['LeadEvaluatorID'],
          "Name" => $row['Name'],
          "LowestBid" => $row['LowestBid'],
          "Description" => $row['Description'],
          "Status" => $row['Status'],
          "StatusName" => $row['StatusName'],
          "CategoryID" => $row['CategoryID'],
          "CreatedDate" => $row['CreatedDate'],
          "LastEditDate" => $row['LastEditDate'],
          "ProposalCount" => $ProposalCount,
          "MinimumScore" =>  $row['MinimumScore'],
          "TotalPoints" =>  $row['TotalScore']
      );
     
      array_push($opportunities_arr["opportunity"], $opportunity_arr);
    }
  }
  // make it json format
  print_r(trim(json_encode($opportunities_arr)));
}
?>

