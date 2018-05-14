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
include_once '../objects/bidder.php';

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
  
  $proposal->selectByID($ProposalID);

  if(isset($proposal->BidderID))
  {
    $BidderID = $proposal->BidderID;
    $bidder = new Bidder($db);
    $bidder->selectByBidderID($BidderID);

    $bidder_arr = array(
      "id" =>  $bidder->id,
      "bidopsid" =>  $bidder->bidopsid,
      "first_name" =>  $bidder->first_name,
      "last_name" =>  $bidder->last_name,
      "email" =>  $bidder->email,
      //"password" =>  $bidder->password,
      "phone" =>  $bidder->phone,
      "middle_init" => $bidder->middle_init,
      "address" => $bidder->address,
      "user_name" => $bidder->user_name
    );

    // make it json format
    print_r(json_encode($bidder_arr));
  }
  else
  {

  }
}
else
{
  
}
?>

