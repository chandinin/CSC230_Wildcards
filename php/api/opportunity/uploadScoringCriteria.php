<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

date_default_timezone_set('America/Tijuana');

include_once '../config/Database.php';
include_once '../config/FileSystem.php';
include_once '../objects/opportunity.php';

// prepare to retrieve bidder data by instantiate the Bidder.
$filesystem = new FileSystem();
$database = new Database();
$db = $database->Connect();

$opportunity = new Opportunity($db);

$temp_base_dir = $filesystem->base_dir;
$base_url = $filesystem->base_url;

//
//
// $date = new DateTime('2000-01-01');
// echo $date->format('Y-m-d H:i:s');
// 
$date = new DateTime(date("Y/m/d"));
$ExpirationDate = $date->format('Y-m-d H:i:s');

//date("Y/m/d")

$Exists = "";
$Success = false;

//if(is_uploaded_file($tempFilePath))
if(isset($_POST["submit"]))
{

  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["opportunityid"]))
  {
    $OpportunityID = $_POST_LowerCase["opportunityid"];

    if(isSet($_POST_LowerCase["expirationdate"]))
    { 
      $ExpirationDate = $_POST_LowerCase["expirationdate"];
      $ExpirationDate = htmlspecialchars(strip_tags($ExpirationDate));
      $date = new DateTime($ExpirationDate);
      $ExpirationDate = $date->format('Y-m-d H:i:s');
    }

    $file_size = $_FILES["filename"]["size"];
    $filename = basename($_FILES['filename']['name']);
    $SCID = $opportunity->getNewSCID();
    $tempFilePath =  $temp_base_dir . "OSC" .$OpportunityID . "_" . $SCID . "_" . $filename;
    $file_type = strtolower(pathinfo($tempFilePath,PATHINFO_EXTENSION));

    if (move_uploaded_file($_FILES["filename"]["tmp_name"], $tempFilePath)) 
    {
      $url = $base_url . "OSC" .$OpportunityID . "_" . $SCID . "_" . $filename;

      /* Delete Previous Scoring Opportunity  */
      $opportunity->DeleteScoringCriteria($OpportunityID);

      if($opportunity->UploadScoringCriteria($SCID, $OpportunityID, $filename, $tempFilePath, $url))
      {
        $Exists = "Uploaded Document";
        $Success = true;
        echo '{';
        echo ' "message" : "Upload Successful."';
        echo ', "filename" : "'. $filename .'"';
        echo ', "OpportunityID" : "'. $OpportunityID .'"';
        echo ', "URL" : "'. $url .'"';
        echo '}';
      }
      else
      {
        echo '{';
        echo ' "message" : "File was successfully uploaded and moved to file repository, but error occurred."';
        echo ', "message2" : "Database operation failed!  Could not add record to Scoring Criteria table."';
        echo ', "SCID" : "'. $SCID .'"';
        echo ', "OpportunityID" : "'. $OpportunityID .'"';
        echo ', "filename" : "'. $filename .'"';
        echo ', "tempFilePath" : "'. $tempFilePath .'"';
        echo ', "URL" : "'. $url .'"';
        echo '}';
      }
    } 
    else 
    {
      echo '{';
      echo ' "message" : "Sorry, there was an error uploading your file.",';
      echo ' "temp_base_dir" : "'.$temp_base_dir.'",';
      echo ' "base_url" : "'. $base_url .'"';
      echo '}';
    }
  }
}
?>