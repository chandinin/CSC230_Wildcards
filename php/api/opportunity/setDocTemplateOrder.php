<?php

/**
 * Method: GetDocTemplates
 * Description: Gets a JSON table of templates with names and urls.
 *              
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/doctemplate.php';

$database = new Database();
$db = $database->Connect();

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  if(isset($data->OpportunityID) and !is_null($data->OpportunityID))
  {
    $OpportunityID = $data->OpportunityID;
    $doctemplate = new DocTemplate($db);
    
    if(isset($data->SortOrder) and !is_null($data->SortOrder))
    {
      $Index = 0;
      $SortOrder = $data->SortOrder;
      foreach($SortOrder as $DocTemplateID)
      { 
        if($doctemplate->SetOrder($DocTemplateID, $Index))
        {
        }
        else
        {
          echo '{';
          echo ' "DocTemplateID" : "'.$DocTemplateID.'"';
          echo ' "Index" : "'.$Index.'"';
          echo '}';
        }
        $Index = $Index + 1; 
      }
    }    
  }
  else
  {
    echo '{';
    echo ' "message" : "Error - Missing OpportunityID"';
    echo '}';
  }
}
else
{
    echo '{';
    echo ' "message" : "Missing JSON"';
    echo '}';
}
?>
