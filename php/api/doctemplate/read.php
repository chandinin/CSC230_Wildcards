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
if(isSet($_POST_LowerCase["opportunityid"]))
{
  $opportunityID = $_POST_LowerCase["opportunityid"];

  //Search
  $stmt = $doctemplate->selectByoppID($opportunityID);
  $rowCount = $stmt->rowCount();

  $doctemplates_arr = array();
  $doctemplates_arr["doctemplate"] = array();

  if($rowCount > 0)
  {
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $doctemplate_arr = array(
          "DocTemplateID" => $row['DocTemplateID'],
          "DocTitle" => $row['DocTitle'],
          "Path" => $row['Path'],
          "Blob" => $row['Blob'],
          "DisplayTitle" => $row['DisplayTitle'],
          "PostedDate" => $row['PostedDate']
      );
     
      array_push($doctemplates_arr["doctemplate"], $doctemplate_arr);
    }
  }
  // make it json format
  print_r(json_encode($doctemplates_arr));
}
else if(isSet($_POST_LowerCase["doctemplateid"]))
{
  $doctemplateID = $_POST_LowerCase["doctemplateid"];

  $doctemplate->selectByDocTemplateID($doctemplateID);

  $doctemplate_arr = array(
    "doctemplateid" =>  $doctemplate->DocTemplateID,
    "doctitle" =>  $doctemplate->DocTitle,
    "path" =>  $doctemplate->Path,
    "blob" =>  $doctemplate->Blob,
    "DisplayTitle" => $doctemplate->DisplayTitle,
    "PostedDate" => $doctemplate->PostedDate
  );

  // make it json format
  print_r(json_encode($doctemplate_arr));
}
else if(isSet($_POST_LowerCase["doctitle"]))
{
  $doctitle = $_POST_LowerCase["doctitle"];

  $doctitle = htmlspecialchars(strip_tags($doctitle));

  $stmt = $doctemplate->searchByTitle($doctitle);
  $rowCount = $stmt->rowCount();

  $doctemplates_arr = array();
  $doctemplates_arr["doctemplate"] = array();

  if($rowCount > 0)
  {
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $doctemplate_arr = array(
          "DocTemplateID" => $row['DocTemplateID'],
          "DocTitle" => $row['DocTitle'],
          "Path" => $row['Path'],
          "Blob" => $row['Blob'],
          "DisplayTitle" => $row['DisplayTitle'],
          "PostedDate" => $row['PostedDate']
      );
     
      array_push($doctemplates_arr["doctemplate"], $doctemplate_arr);
    }
  }
  // make it json format
  print_r(json_encode($doctemplates_arr));
}
else
{
  //Search
  $stmt = $doctemplate->selectAll();
  $rowCount = $stmt->rowCount();

  $doctemplates_arr = array();
  $doctemplates_arr["doctemplate"] = array();

  if($rowCount > 0)
  {

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $doctemplate_arr = array(
          "DocTemplateID" => $row['DocTemplateID'],
          "DocTitle" => $row['DocTitle'],
          "Path" => $row['Path'],
          "Blob" => $row['Blob'],
          "DisplayTitle" => $row['DisplayTitle'],
          "PostedDate" => $row['PostedDate']
      );
     
      array_push($doctemplates_arr["doctemplate"], $doctemplate_arr);
    }
  }
  // make it json format
  print_r(json_encode($doctemplates_arr));
}
?>

