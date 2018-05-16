<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/doc.php';

$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["docid"]) || isSet($_GET_LowerCase["docid"]))
{
  $DocID = isSet($_GET_LowerCase["docid"]) ? $_GET_LowerCase["docid"] : $_POST_LowerCase["docid"];

  $database = new Database();
  $db = $database->Connect();

  $doc = new Doc($db);

  //Search
  $doc->selectByDocID($DocID);

  $doc_arr = array(
    "DocID" =>  $doc->DocID,
    "DocTitle" =>  $doc->DocTitle,
    "Path" =>  $doc->Path,
    "Blob" =>  $doc->Blob,
    "Url" =>  $doc->Url,
    "Description" =>  $doc->Description,
    "CreatedDate" =>  $doc->CreatedDate,
    "LastEditDate" =>  $doc->LastEditDate,
    "SortOrder" =>  $doc->SortOrder
  );

  // make it json format
  print_r(trim(json_encode($doc_arr)));
}

?>
