<?php

include_once '../config/Database.php';
include_once '../objects/doctemplate.php';

$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["doctemplateid"]) || isSet($_GET_LowerCase["doctemplateid"]))
{
  $DocTemplateID = isSet($_GET_LowerCase["doctemplateid"]) ? $_GET_LowerCase["doctemplateid"] : $_POST_LowerCase["doctemplateid"];

  $database = new Database();
  $db = $database->Connect();

  $doctemplate = new DocTemplate($db);
  $doctemplate->selectByDocTemplateID($DocTemplateID);

  $Path = $doctemplate->Path;
  $DocTitle = $doctemplate->DocTitle;

  //$myfile = fopen($Path, "r") or die("Unable to open file!");
  $size = filesize($Path);
  $MimeType = strtolower(pathinfo($Path,PATHINFO_EXTENSION));
  //$file_content = fread($myfile,$size);
  //$file_content = bin2hex($file_content);

  header("Content-length: $size");
  header("Content-type: $MimeType");
  header("Content-Disposition: attachment; filename='" . $DocTitle . "." . "'");

  readfile($Path);
}
?>

