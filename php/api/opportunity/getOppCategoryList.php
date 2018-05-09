<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/opportunity.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve opportunity data by instantiate the opportunity.
$opportunity = new Opportunity($db);
$stmt = $opportunity->getCategories();
$rowCount = $stmt->rowCount();

$categories_arr = array();
$categories_arr["Category"] = array();

if($rowCount > 0)
{
  while($row = $stmt->fetch(PDO::FETCH_ASSOC))
  {
    $category_arr = array(
          "CategoryID" => $row['CategoryID'],
          "Name" => $row['Name']
      );

    array_push($categories_arr["Category"], $category_arr);
  }
}

// make it json format
print_r(json_encode($categories_arr));
?>
