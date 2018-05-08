<?php
date_default_timezone_set('America/Tijuana');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/opportunity.php';

include_once '../config/Database.php';

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
  // Query database for our user with ID
  $query = "SELECT * FROM OppCategory;";

  // Get our connection
  $conn = $database->Connect();

  // prepare query statement
  $stmt = $conn->prepare($query);

  // execute query
  $stmt->execute();

  $categories_array = array();

  while($row = $stmt->fetch(PDO::FETCH_ASSOC))
  {
    array_push($categories_array, $row);
  }

  print_r(json_encode($categories_array));
}

?>

