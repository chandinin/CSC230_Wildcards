<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/proposal.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve proposal data by instantiate the proposal.
$proposal = new Proposal($db);
$stmt = $proposal->getProposalStatusList();
$rowCount = $stmt->rowCount();

$ProposalStatusList_arr = array();
$ProposalStatusList_arr["ProposalStatus"] = array();

if($rowCount > 0)
{
  while($row = $stmt->fetch(PDO::FETCH_ASSOC))
  {
    $ProposalStatus_arr = array(
          "StatusID" => $row['StatusID'],
          "Name" => $row['Name']
      );

    array_push($ProposalStatusList_arr["ProposalStatus"], $ProposalStatus_arr);
  }
}

// make it json format
print_r(json_encode($ProposalStatusList_arr));
?>

