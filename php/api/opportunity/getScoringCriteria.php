<?php

include_once '../config/Database.php';
include_once '../objects/opportunity.php';

$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["opportunityid"]) || isSet($_GET_LowerCase["opportunityid"]))
{
  $OpportunityID = isSet($_GET_LowerCase["opportunityid"]) ? $_GET_LowerCase["opportunityid"] : $_POST_LowerCase["opportunityid"];

  //echo "ID = " . $OpportunityID;

  // prepare to retrieve bidder data by instantiate the Bidder.
  $database = new Database();
  $db = $database->Connect();

  $opportunity = new Opportunity($db);
  
  $stmt = $opportunity->getBlobByID($OpportunityID);
  $rowCount = $stmt->rowCount();
    
  if($rowCount > 0) 
  {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $fileData = $row['ScoringCategoryBlob'];
    $MimeType = $row['MimeType'];
    $size = $row['size'];
    $filename = $row['filename'];

    header("Content-length: $size");
    header("Content-type: $MimeType");
    header("Content-Disposition: attachment; filename=$filename");

    echo $fileData;
  }     
  else
  {
    echo '{';
    echo ' "message" : "Sorry, there was an error retrieving your file."';
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
