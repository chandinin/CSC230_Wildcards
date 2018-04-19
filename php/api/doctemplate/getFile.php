<?php

include_once '../config/Database.php';
include_once '../objects/doctemplate.php';

$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["doctemplateid"]) || isSet($_GET_LowerCase["doctemplateid"]))
{
  $DocTemplateID = isSet($_GET_LowerCase["doctemplateid"]) ? $_GET_LowerCase["doctemplateid"] : $_POST_LowerCase["doctemplateid"];
  $pos = strpos($DocTemplateID, "_");

  if($pos !== FALSE)
  {
    $DocTemplateIDArr = explode("_", $DocTemplateID);
    $DocTemplateID = $DocTemplateIDArr[1];
  }

  $database = new Database();
  $db = $database->Connect();

  $doctemplate = new DocTemplate($db);

  if($doctemplate->DocTemplateExistsByID($DocTemplateID))
  {
    //header('Content-Type: application/json');
    //echo '{';
    //echo ' message : "File Exists.  Record(DocTemplateID='.$DocTemplateID.')"';
    //echo '}';

    $doctemplate->selectByDocTemplateID($DocTemplateID);

    $Path = $doctemplate->Path;
    $DocTitle = $doctemplate->DocTitle;

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
    echo ' message : "File Not Found.  Record(DocTemplateID='.$DocTemplateID.')"';
    echo '}';
  }
}

?>

