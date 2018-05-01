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
include_once '../objects/opportunity.php';

// prepare to retrieve bidder data by instantiate the Bidder.
$database = new Database();
$db = $database->Connect();

$opportunity = new Opportunity($db);

$temp_base_dir = "../../../data/files/";
$base_url = "https://athena.ecs.csus.edu/~wildcard/data/files/";
//$base_url = "http://localhost/data/files/";

//
//
// $date = new DateTime('2000-01-01');
// echo $date->format('Y-m-d H:i:s');
// 
$date = new DateTime(date("Y/m/d"));
$ExpirationDate = $date->format('Y-m-d H:i:s');

//date("Y/m/d")

$Exists = "";

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
    $DocTemplateID = $opportunity->getNewDocTemplateID();
    $tempFilePath =  $temp_base_dir . "O" .$OpportunityID . "_" . $DocTemplateID . "_" . $filename;
    $file_type = strtolower(pathinfo($tempFilePath,PATHINFO_EXTENSION));

    if (move_uploaded_file($_FILES["filename"]["tmp_name"], $tempFilePath)) 
    {
      //$url = $base_url . "doctemplate/getFile.php?doctemplateid=" . $OpportunityID . "_" . $DocTemplateID;
      $url = $base_url . "O" .$OpportunityID . "_" . $DocTemplateID . "_" . $filename;
      if($opportunity->UploadDocTemplate($DocTemplateID, $filename, $tempFilePath, $url))
      {
        $opportunity->RelateDocTemplateToOppID($OpportunityID, $DocTemplateID, $ExpirationDate);
        $Exists = "Uploaded Document";
      }

      echo '{';
      echo ' "message" : "Uploading Successful."';
      echo ', "message2" : "DocTemplateID = '. $DocTemplateID .'"';
      echo ', "message3" : "Exists = '. $Exists .'"';
      echo ', "message4" : "URL = '. $url .'"';
      echo '}';
    } 
    else 
    {
      echo '{';
      echo ' "message" : "Sorry, there was an error uploading your file."';
      echo '}';
    }
  }
}
?>
