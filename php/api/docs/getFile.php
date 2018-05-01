<?php

include_once '../config/Database.php';
include_once '../objects/doc.php';

$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["docid"]) || isSet($_GET_LowerCase["docid"]))
{
  $DocID = isSet($_GET_LowerCase["docid"]) ? $_GET_LowerCase["docid"] : $_POST_LowerCase["docid"];
  $pos = strpos($DocID, "_");

  if($pos !== FALSE)
  {
    $DocIDArr = explode("_", $DocID);
    $DocID = $DocIDArr[1];
  }

  $database = new Database();
  $db = $database->Connect();

  $doc = new Doc($db);

  if($doc->DocExistsByID($DocID))
  {
    //header('Content-Type: application/json');
    //echo '{';
    //echo ' message : "File Exists.  Record(DocID='.$DocID.')"';
    //echo '}';

    $doc->selectBydocID($DocID);

    $Path = $doc->Path;
    $DocTitle = $doc->DocTitle;

    $size = filesize($Path);
    $MimeType = strtolower(pathinfo($Path,PATHINFO_EXTENSION));

    header("Content-length: $size");
    header("Content-type: $MimeType");
    header("Content-Disposition: attachment; filename=" . $DocTitle . "");

    readfile($Path);
  }
  else
  {
    header('Content-Type: application/json');
    echo '{';
    echo ' message : "File Not Found.  Record(docID='.$DocID.')"';
    echo '}';
  }
}

?>

