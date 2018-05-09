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
$stmt = $opportunity->getOppStatusList();
$rowCount = $stmt->rowCount();

$OppStatusList_arr = array();
$OppStatusList_arr["OppStatus"] = array();

if($rowCount > 0)
{
  while($row = $stmt->fetch(PDO::FETCH_ASSOC))
  {
    $OppStatus_arr = array(
          "StatusID" => $row['StatusID'],
          "Name" => $row['Name']
      );

    array_push($OppStatusList_arr["OppStatus"], $OppStatus_arr);
  }
}

// make it json format
print_r(json_encode($OppStatusList_arr));
?>
