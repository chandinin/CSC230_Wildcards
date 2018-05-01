<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/bidder.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve bidder data by instantiate the Bidder.
$bidder = new Bidder($db);

// get bidderID from POST
$_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
if(isSet($_POST_LowerCase["bidderid"]) || isSet($_POST_LowerCase["id"]))
{
  $bidderID = "";
  if(isSet($_POST_LowerCase["bidderid"]))
    $bidderID = $_POST_LowerCase["bidderid"];
  else
    $bidderID = $_POST_LowerCase["id"];

  //Search
  $stmt = $bidder->getAllSubscriptions($bidderID);
  $rowCount = $stmt->rowCount();

  $subscriptions_arr = array();
  $subscriptions_arr["subscription"] = array();

  if($rowCount > 0)
  {
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $subscription_arr = array(
          "ID" => $row['ID'],
          "CategoryID" => $row['CategoryID']
      );
     
      array_push($subscriptions_arr["subscription"], $subscription_arr);
    }
  }
  // make it json format
  print_r(json_encode($subscriptions_arr));
}
else if(isSet($_POST_LowerCase["categoryid"]))
{
  $CategoryID = $_POST_LowerCase["categoryid"];

  //Search
  $stmt = $bidder->getAllSubscriptionsByCategory($CategoryID);
  $rowCount = $stmt->rowCount();

  $subscriptions_arr = array();
  $subscriptions_arr["subscription"] = array();

  if($rowCount > 0)
  {
    while($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
      $subscription_arr = array(
          "ID" => $row['ID'],
          "CategoryID" => $row['CategoryID']
      );
     
      array_push($subscriptions_arr["subscription"], $subscription_arr);
    }
  }
  // make it json format
  print_r(json_encode($subscriptions_arr));
}
?>
