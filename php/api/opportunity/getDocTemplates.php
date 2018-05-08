<?php

/**
 * Method: GetDocTemplates
 * Description: Gets a JSON table of templates with names and urls.
 *              
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

date_default_timezone_set('America/Tijuana');

include_once '../config/Database.php';
include_once '../objects/opportunity.php';

$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["opportunityid"]) || isSet($_GET_LowerCase["opportunityid"]))
{
  $OpportunityID = isSet($_GET_LowerCase["opportunityid"]) ? $_GET_LowerCase["opportunityid"] : $_POST_LowerCase["opportunityid"];

  // prepare to retrieve bidder data by instantiate the Bidder.
  $database = new Database();
  $db = $database->Connect();

  $opportunity = new Opportunity($db);
  
  $stmt = $opportunity->getDocTemplates($OpportunityID);
  $rowCount = $stmt->rowCount();
    
  if($rowCount > 0)
  {
    $DocTemplates_arr = array();
    $DocTemplates_arr["doctemplate"] = array();

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $DocTemplate_arr = array(
          "DocTemplateID" => $row['DocTemplateID'],
          "DocTitle" => $row['DocTitle'],
          "DisplayTitle" => $row['DisplayTitle'],
          "PostedDate" => $row['PostedDate'],
          "SortOrder" => $row['SortOrder'],
          "Url" => $row['Url']
      );
     
      array_push($DocTemplates_arr["doctemplate"], $DocTemplate_arr);
    }

    // make it json format
    print_r(json_encode($DocTemplates_arr));
  }
  else
  {
    echo '{';
    echo ' "message" : "Sorry, there was an error retrieving your file.",';
    echo ' "OpportunityID" : "' . $OpportunityID . '"';
    echo '}';
  }
}
else
{
  echo '{';
  echo ' "message" : "Sorry, there was an error retrieving your file."';
  echo '}';
}
?>

