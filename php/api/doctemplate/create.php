<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/doctemplate.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve DocTemplate data by instantiate the DocTemplate.
$doctemplate = new DocTemplate($db);

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  $doctemplate->DocTemplateID = $data->DocTemplateID;
  $doctemplate->DocTitle = $data->DocTitle;
  $doctemplate->Path = $data->Path;
  $doctemplate->Blob = $data->Blob; 

  if($doctemplate->create())
  {  
    echo '{';
       echo ' message : "Create suceeded. "';
    echo '}';
  }
  else
  {
    echo '{';
       echo ' message : "Create failed."';
    echo '}';
  }
}
else
// get bidderID from POST
{
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["doctemplateid"]))
  {
    $doctemplateID = $_POST_LowerCase["doctemplateid"];
  
    //Search
    $doctemplate->DocTemplateID = $doctemplateID;

    if(isSet($_POST_LowerCase["doctitle"]))
    {
      $doctitle = $_POST_LowerCase["doctitle"];
      $doctemplate->DocTitle = $doctitle;
    }

    if(isSet($_POST_LowerCase["path"]))
    {
      $Path = $_POST_LowerCase["path"];
      $Path = htmlspecialchars(strip_tags($Path));
      $doctemplate->Path =$Path;
    }

    if(isSet($_POST_LowerCase["blob"]))
    {
      $blob = $_POST_LowerCase["blob"];
      $blob = htmlspecialchars(strip_tags($blob));
      $doctemplate->Blob = $blob;
    }

    if($doctemplate->create())
    {  
      echo '{';
      echo ' message : "Create suceeded.  Record (DoctemplateID='.$doctemplateID.')"';
      echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Create failed.  Record (DoctemplateID='.$doctemplateID.')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "Create failed.  Parameter Missing (DoctemplateID)."';
    echo '}';
  }
}
?>

