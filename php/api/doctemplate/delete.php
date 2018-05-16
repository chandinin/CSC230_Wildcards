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

// prepare to retrieve doctemplate data by instantiate the doctemplate.
$doctemplate = new DocTemplate($db);

// get doctemplateID from POST
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["doctemplateid"]))
{
  $doctemplateID = $_POST_LowerCase["doctemplateid"];
  $DocTemplateIDArr = explode("_", $doctemplateID);

  //Search
  $doctemplate->DocTemplateID = $doctemplateID;
  $doctemplate->selectByDocTemplateID($DocTemplateIDArr[1]);

  //delete doctemplate.
  if($doctemplate->delete())
  {  
<<<<<<< HEAD
    $doctemplate->deleteOppDocTemplateByID($DocTemplateIDArr[1]);
=======
    $doctemplate->deleteOppDocTemplateByID($doctemplateID);
>>>>>>> c8ecde4793884de43a1268b5eea9b9b689a0ac8e

    echo '{';
    echo ' message : "Delete suceeded.  (DoctemplateID='.$doctemplateID.')"';
    echo '}';
  }
  else
  {
    echo '{';
    echo ' message : "Delete failed.  (DoctemplateID='.$doctemplateID.')"';
    echo '}';
  }
}
?>

