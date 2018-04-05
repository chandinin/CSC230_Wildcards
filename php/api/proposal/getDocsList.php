<?php

/**
 * Method: GetDocs
 * Description: Gets a JSON table of templates with names and urls.
 *              
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/proposal.php';

$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["proposalid"]) || isSet($_GET_LowerCase["proposalid"]))
{
  $ProposalID = isSet($_GET_LowerCase["proposalid"]) ? $_GET_LowerCase["proposalid"] : $_POST_LowerCase["proposalid"];

  // prepare to retrieve bidder data by instantiate the Bidder.
  $database = new Database();
  $db = $database->Connect();

  $proposal = new Proposal($db);

  //  echo '{';
  //  echo ' "message" : "$ProposalID = ' . $ProposalID . '"';
  //  echo '}';
  
  $stmt = $proposal->getDocByProposalID($ProposalID);
  $rowCount = $stmt->rowCount();
    
  if($rowCount > 0)
  {
    $Docs_arr = array();
    $Docs_arr["doc"] = array();

    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $Doc_arr = array(
          "DocID" => $row['DocID'],
          "DocTitle" => $row['DocTitle'],
          "Url" => $row['Url'],
          "DocTemplateID" => $row['DocTemplateID']
      );
     
      array_push($Docs_arr["doc"], $Doc_arr);
    }

    // make it json format
    print_r(json_encode($Docs_arr));
  }
  else
  {
    echo '{';
    echo ' "message" : "Sorry, there was an error retrieving your file."';
    echo '}';
  }
}
else
{
  echo '{';
  echo ' "message" : "Sorry, there was an error retrieving your file."';
  echo '}';
}
?>

