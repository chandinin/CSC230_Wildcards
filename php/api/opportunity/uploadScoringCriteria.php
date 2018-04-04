<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/opportunity.php';

$temp_base_dir = "../../../data/files/";
$filename = basename($_FILES['filename']['name']);
$tempFilePath =  $temp_base_dir . $filename;
$file_type = strtolower(pathinfo($tempFilePath,PATHINFO_EXTENSION));

//if(is_uploaded_file($tempFilePath))
if(isset($_POST["submit"]))
{
  $file_size = $_FILES["filename"]["size"];

  if (move_uploaded_file($_FILES["filename"]["tmp_name"], $tempFilePath)) 
  {
    $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
    if(isSet($_POST_LowerCase["opportunityid"]))
    {
      $OpportunityID = $_POST_LowerCase["opportunityid"];

      // prepare to retrieve bidder data by instantiate the Bidder.
      $database = new Database();
      $db = $database->Connect();

      $opportunity = new Opportunity($db);
      if($opportunity->UploadBlobByID($tempFilePath, $OpportunityID, $file_type,
  $file_size,
  $filename))
      { 
        echo '{';
        echo ' "message" : "The file '. $filename . ' has been uploaded."';
        echo '}';
      }
      else
      {
        echo '{';
        echo ' "message" : "Sorry, there was an error uploading your file."';
        echo '}';
      }
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

