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

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  $opportunity->OpportunityID = $data->OpportunityID;
  $opportunity->ClosingDate =$data->ClosingDate;
  $opportunity->ScoringCategoryBlob = $data->ScoringCategoryBlob;
  $opportunity->LeadEvaluatorID = $data->LeadEvaluatorID;
  $opportunity->LowestBid = $data->LowestBid;
  $opportunity->Description = $data->Description;

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
else if(isSet($_POST["opportunityID"]))
{
  $opportunityID = $_POST["opportunityID"];

  //Search
  $opportunity->selectByID($opportunityID);

  if(isSet($_POST["ClosingDate"]))
  {
    $ClosingDate = $_POST["ClosingDate"];
    $ClosingDate = htmlspecialchars(strip_tags($ClosingDate));
    $opportunity->ClosingDate =$ClosingDate;
  }

  if(isSet($_POST["ScoringCategoryBlob"]))
  {
    $ScoringCategoryBlob = $_POST["ScoringCategoryBlob"];
    $ScoringCategoryBlob = htmlspecialchars(strip_tags($ScoringCategoryBlob));
    $opportunity->ScoringCategoryBlob = $ScoringCategoryBlob;
  }

  if(isSet($_POST["LeadEvaluatorID"]))
  {
    $LeadEvaluatorID = $_POST["LeadEvaluatorID"];
    $LeadEvaluatorID = htmlspecialchars(strip_tags($LeadEvaluatorID));
    $opportunity->LeadEvaluatorID = $LeadEvaluatorID;
  }

  if(isSet($_POST["LowestBid"]))
  {
    $LowestBid = $_POST["LowestBid"];
    $LowestBid = htmlspecialchars(strip_tags($LowestBid));
    $opportunity->LowestBid = $LowestBid;
  }

  if(isSet($_POST["Description"]))
  {
    $Description = $_POST["Description"];
    $Description = htmlspecialchars(strip_tags($Description));
    $opportunity->Description = $Description;
  }

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
else
{
  echo '{';
     echo ' message : "opportunity not found."';
  echo '}';
}

?>

