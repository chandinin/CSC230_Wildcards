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
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["opportunityid"]))
{
  $opportunityID = $_POST_LowerCase["opportunityid"];

  //Search
  $opportunity->selectByID($opportunityID);

  $opportunity_arr = array(
    "OpportunityID" =>  $opportunity->OpportunityID,
    "ClosingDate" =>  $opportunity->ClosingDate,
    "ScoringCategoryBlob" =>  $opportunity->ScoringCategoryBlob,
    "LeadEvaluatorID" =>  $opportunity->LeadEvaluatorID,
    "Name" =>  $opportunity->Name,
    "LowestBid" =>  $opportunity->LowestBid,
    "Description" =>  $opportunity->Description
  );

  // make it json format
  print_r(json_encode($opportunity_arr));
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
      $opportunity_arr = array(
          "OpportunityID" => $row['OpportunityID'],
          "ClosingDate" => $row['ClosingDate'],
          "ScoringCategoryBlob" => $row['ScoringCategoryBlob'],
          "LeadEvaluatorID" => $row['LeadEvaluatorID'],
          "Name" => $row['Name'],
          "LowestBid" => $row['LowestBid'],
          "Description" => $row['Description']
      );
     
      array_push($opportunities_arr["opportunity"], $opportunity_arr);
    }
  }
  // make it json format
  print_r(json_encode($opportunities_arr));
}
?>
