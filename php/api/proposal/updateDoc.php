<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

date_default_timezone_set('America/Tijuana');

include_once '../config/Database.php';
include_once '../objects/doc.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve bidder data by instantiate the Bidder.
$doc = new Doc($db);

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  if(isset($data->DocID) and !is_null($data->DocID))
  {
    $DocID = $data->DocID;
    $doc = new Doc($db);
    $doc->selectByDocID($DocID);

    if(isset($data->DocTitle) and !is_null($data->DocTitle))
      $doc->DocTitle = $data->DocTitle;

    if(isset($data->Path) and !is_null($data->Path))
      $doc->Path = $data->Path;

    if(isset($data->Url) and !is_null($data->Url))
      $doc->Url = $data->Url;

    if(isset($data->Blob) and !is_null($data->Blob))
      $doc->Blob = $data->Blob; 

    if(isset($data->DisplayTitle) and !is_null($data->DisplayTitle))
      $doc->DisplayTitle = $data->DisplayTitle; 

    if(isset($data->Description) and !is_null($data->Description))
      $doc->Description = $data->Description; 

    if(isset($data->SortOrder) and !is_null($data->SortOrder))
      $doc->SortOrder = $data->SortOrder; 

    if($doc->update())
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
}
// get bidderID from POST
else 
{
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["docid"]))
  {
    $DocID = $_POST_LowerCase["docid"];

    //Search
    $doc->selectByDocID($DocID);

    if(isSet($_POST_LowerCase["doctitle"]))
    {
      $doctitle = $_POST_LowerCase["doctitle"];
      $doc->DocTitle = $doctitle;
    }

    if(isSet($_POST_LowerCase["blob"]))
    {
      $blob = $_POST_LowerCase["blob"];
      $blob = htmlspecialchars(strip_tags($blob));
      $doc->Blob = $blob;
    }

    if(isSet($_POST_LowerCase["displaytitle"]))
    {
      $DisplayTitle = $_POST_LowerCase["displaytitle"];
      $DisplayTitle = htmlspecialchars(strip_tags($DisplayTitle));
      $doc->DisplayTitle = $DisplayTitle;
    }

    if(isSet($_POST_LowerCase["description"]))
    {
      $Description = $_POST_LowerCase["description"];
      $Description = htmlspecialchars(strip_tags($Description));
      $doc->Description = $Description;
    }

    if(isSet($_POST_LowerCase["sortorder"]))
    {
      $SortOrder = $_POST_LowerCase["sortorder"];
      $SortOrder = htmlspecialchars(strip_tags($SortOrder));
      $doc->SortOrder = $SortOrder;
    }

    if($doc->update())
    {  
      echo '{';
      echo ' message : "Update suceeded.  Record (DocID='.$DocID.')"';
      echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Update failed.  Record (DocID='.$DocID.')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "Doc not found!  DocID was missing.")"';
    echo '}';
  }
}
?>

