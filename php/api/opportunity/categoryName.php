<?php
date_default_timezone_set('America/Tijuana');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/opportunity.php';

$database = new Database();
$db = $database->Connect();

// get opportunityID from POST
$_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["categoryid"])
|| isSet($_GET_LowerCase["categoryid"]))
{
  $categoryid = isSet($_GET_LowerCase["categoryid"]) ?
     $_GET_LowerCase["categoryid"] : $_POST_LowerCase["categoryid"];

  $opportunity = new Opportunity($db);

  //Search
  $stmt = $opportunity->getCategoryByID($categoryid);
  $rowCount = $stmt->rowCount();

  if($rowCount > 0)
  {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $category_arr = array(
          "CategoryID" => $row['CategoryID'],
          "Name" => $row['Name']
      );
  }

  // make it json format
  print_r(json_encode($category_arr));
}
else
{
  echo '{';
  echo ' "message" : "Error. Category not found."';
  echo '}';
}

?>
