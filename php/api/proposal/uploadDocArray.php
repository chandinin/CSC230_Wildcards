<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

date_default_timezone_set('America/Tijuana');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/proposal.php';

$temp_base_dir = "../../../data/files/";

$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
//if(is_uploaded_file($tempFilePath))
if(isset($_POST_LowerCase["submit"]))
{
  $date = new DateTime(date("Y/m/d"));
  $ExpirationDate = $date->format('Y-m-d H:i:s');

  if(isSet($_POST_LowerCase["proposalid"]))
  {
    $proposalID = $_POST_LowerCase["proposalid"];

    // prepare to retrieve bidder data by instantiate the Bidder.
    $database = new Database();
    $db = $database->Connect();
    $proposal = new Proposal($db);
    $base_url = "https://athena.ecs.csus.edu/~wildcard/php/api/";
   
    foreach($_FILES['filename']['tmp_name'] as $key => $tmpName) 
    {
      $filename = basename($_FILES['filename']['name'][$key]);
      $tempFilePath =  $temp_base_dir . $filename;
      $file_type = strtolower(pathinfo($tempFilePath,PATHINFO_EXTENSION));
      $file_size = $_FILES['filename']['size'][$key];
      $DocID = $proposal->getNewDocID();

      if(move_uploaded_file($_FILES["filename"]["tmp_name"][$key], $tempFilePath))
      {
        $url = $base_url . "docs/getFile.php?docid=" 
                . $proposalID . "_" . $DocID;
        if($proposal->UploadDoc($DocID, 
                $filename, $tempFilePath, $url))
        {
          $proposal->RelateDocsToProposalID($proposalID, 
                        $DocID, $ExpirationDate);
        }  
      }
    }

    echo '{';
    echo ' "message" : "The files were successfully uploaded."';
    echo '}';
  }
  else 
  {
    echo '{';
    echo ' "message" : "Sorry, there was an error uploading your file."';
    echo '}';
  }
}
?>

