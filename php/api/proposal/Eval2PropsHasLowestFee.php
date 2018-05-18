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
  $result = -1;
  if(isset($data->OpportunityID) and !is_null($data->OpportunityID))
  {
    $opportunityid = $data->OpportunityID;
  
    //Search
    $result = $proposal->AllPropsEval2HasFeeEntered($opportunityid);
  }

  // return decimal
  echo $result;
}
else
{
  $result = -1;

  $_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["opportunityid"]) 
  || isSet($_GET_LowerCase["opportunityid"]))
  {
    $opportunityid = isSet($_GET_LowerCase["opportunityid"]) ?
       $_GET_LowerCase["opportunityid"] : $_POST_LowerCase["opportunityid"];

    //Search
    $result = $proposal->AllPropsEval2HasFeeEntered($opportunityid);
  }
  // return decimal
  echo $result;
}
?>

