<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

date_default_timezone_set('America/Tijuana');

include_once '../config/Database.php';
include_once '../objects/proposal.php';
include_once '../objects/bidder.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve proposal data by instantiate the proposal.
$proposal = new Proposal($db);

$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE && $data !== null)
{
  if(isset($data->Statuses) and !is_null($data->Statuses))
  {
    $StatusList = "";
    $Index = 0;
    $Statuses = $data->Statuses;
    foreach($Statuses as $Status)
    { 
      if($Index > 0)
        $StatusList = $StatusList . ",";

      $StatusList = $StatusList . $Status;
      $Index = $Index + 1;      
    }

    //Search
    $stmt = $proposal->selectByMultStatus($StatusList);
    $rowCount = $stmt->rowCount();

    $proposals_arr = array();
    $proposals_arr["proposal"] = array();

    if($rowCount > 0)
    {
      while($row = $stmt->fetch(PDO::FETCH_ASSOC))
      {
        $BidderID = $row['BidderID'];

        $bidder_arr = array();
        $bidderName = "";
        if(isset($BidderID))
        {
          $bidder = new Bidder($db);
          $bidder->selectByBidderID($BidderID);
          $bidderName = $bidder->first_name . " " . $bidder->last_name;
        }

        $proposal_arr = array(
          "ProposalID" =>  $row['ProposalID'],
          "OpportunityID" =>  $row['OpportunityID'],
          "BidderID" =>  $row['BidderID'],
          "Status" =>  $row['Status'],
          "StatusName" =>  $row['StatusName'],
          "TechnicalScore" =>  $row['TechnicalScore'],
          "FeeScore" =>  $row['FeeScore'],
          "FinalTotalScore" =>  $row['FinalTotalScore'],
          "CreatedDate" =>  $row['CreatedDate'],
          "LastEditDate" =>  $row['LastEditDate'],
          "BidderName" =>  $bidderName,
          "ContractAwarded" => $row['ContractAwarded'],
          "Fee" => $row['Fee']
          );

        array_push($proposals_arr["proposal"], $proposal_arr);
      }
    }

    // make it json format
    print_r(trim(json_encode($proposals_arr)));
  } 

  echo '{';
  echo ' "message" : "Read Succeeded."';
  echo '}';

 
}
else
{
  // get proposalID from POST
  $_GET_LowerCase = array_change_key_case($_GET, CASE_LOWER);
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["proposalid"]) 
  || isSet($_GET_LowerCase["proposalid"]))
  {
    //$proposalID = $_POST_LowerCase["proposalid"];
    $proposalID = isSet($_GET_LowerCase["proposalid"]) ?
    $_GET_LowerCase["proposalid"] : $_POST_LowerCase["proposalid"];

    //Search
    $proposal->selectByID($proposalID);

    $bidder_arr = array();
    $bidderName = "";
    if(isset($proposal->BidderID))
    {
      $BidderID = $proposal->BidderID;
      $bidder = new Bidder($db);
      $bidder->selectByBidderID($BidderID);    
      $bidderName = $bidder->first_name . " " . $bidder->last_name;
    }

    $proposal_arr = array(
      "ProposalID" =>  $proposal->ProposalID,
      "OpportunityID" =>  $proposal->OpportunityID,
      "BidderID" =>  $proposal->BidderID,
      "Status" =>  $proposal->Status,
      "StatusName" =>  $proposal->StatusName,
      "TechnicalScore" =>  $proposal->TechnicalScore,
      "FeeScore" =>  $proposal->FeeScore,
      "FinalTotalScore" =>  $proposal->FinalTotalScore,
      "CreatedDate" =>  $proposal->CreatedDate,
      "LastEditDate" =>  $proposal->LastEditDate,
      "BidderName" =>  $bidderName,
      "ContractAwarded" => $proposal->ContractAwarded,
      "Fee" => $proposal->Fee
    );

    // make it json format
    print_r(trim(json_encode($proposal_arr)));
  }
  else if(isSet($_POST_LowerCase["opportunityid"])
  || isSet($_GET_LowerCase["opportunityid"]))
  {
    $opportunityid = isSet($_GET_LowerCase["opportunityid"]) ?
    $_GET_LowerCase["opportunityid"] : $_POST_LowerCase["opportunityid"];

    if(isSet($_POST_LowerCase["status"]) || isSet($_GET_LowerCase["status"]))
    {
      $status = isSet($_GET_LowerCase["status"]) ?
      $_GET_LowerCase["status"] : $_POST_LowerCase["status"];

      //Search
      $stmt = $proposal->selectByOppIDStatus($opportunityid, $status);
      $rowCount = $stmt->rowCount();

      $proposals_arr = array();
      $proposals_arr["proposal"] = array();

      if($rowCount > 0)
      {
        while($row = $stmt->fetch(PDO::FETCH_ASSOC))
        {
          $BidderID = $row['BidderID'];
  
          $bidder_arr = array();
          $bidderName = "";
          if(isset($BidderID))
          {
            $bidder = new Bidder($db);
            $bidder->selectByBidderID($BidderID);
            $bidderName = $bidder->first_name . " " . $bidder->last_name;
          }

          $proposal_arr = array(
            "ProposalID" =>  $row['ProposalID'],
            "OpportunityID" =>  $row['OpportunityID'],
            "BidderID" =>  $row['BidderID'],
            "Status" =>  $row['Status'],
            "StatusName" =>  $row['StatusName'],
            "TechnicalScore" =>  $row['TechnicalScore'],
            "FeeScore" =>  $row['FeeScore'],
            "FinalTotalScore" =>  $row['FinalTotalScore'],
            "CreatedDate" =>  $row['CreatedDate'],
            "LastEditDate" =>  $row['LastEditDate'],
            "BidderName" =>  $bidderName,
            "ContractAwarded" => $row['ContractAwarded'],
            "Fee" => $row['Fee']
            );

          array_push($proposals_arr["proposal"], $proposal_arr);
        }
      }

      // make it json format
      print_r(trim(json_encode($proposals_arr)));
    }
    else
    {
      //Search
      $stmt = $proposal->selectByOppID($opportunityid);
      $rowCount = $stmt->rowCount();

      $proposals_arr = array();
      $proposals_arr["proposal"] = array();

      if($rowCount > 0)
      {
        while($row = $stmt->fetch(PDO::FETCH_ASSOC))
        {
          $BidderID = $row['BidderID'];

          $bidder_arr = array();
          $bidderName = "";
          if(isset($BidderID))
          {
            $bidder = new Bidder($db);
            $bidder->selectByBidderID($BidderID);
            $bidderName = $bidder->first_name . " " . $bidder->last_name;
           }

          $proposal_arr = array(
            "ProposalID" =>  $row['ProposalID'],
            "OpportunityID" =>  $row['OpportunityID'],
            "BidderID" =>  $row['BidderID'],
            "Status" =>  $row['Status'],
            "StatusName" =>  $row['StatusName'],
            "TechnicalScore" =>  $row['TechnicalScore'],
            "FeeScore" =>  $row['FeeScore'],
            "FinalTotalScore" =>  $row['FinalTotalScore'],
            "CreatedDate" =>  $row['CreatedDate'],
            "LastEditDate" =>  $row['LastEditDate'],
            "BidderName" =>  $bidderName,
            "ContractAwarded" => $row['ContractAwarded'],
            "Fee" => $row['Fee']
            );

          array_push($proposals_arr["proposal"], $proposal_arr);
        }
      }

      // make it json format
      print_r(trim(json_encode($proposals_arr)));    
    }
  }
  else if(isSet($_POST_LowerCase["status"])
  || isSet($_GET_LowerCase["status"]))
  {
    $status = isSet($_GET_LowerCase["status"]) ?
    $_GET_LowerCase["status"] : $_POST_LowerCase["status"];

    //Search
    $stmt = $proposal->selectByStatus($status);
    $rowCount = $stmt->rowCount();

    $proposals_arr = array();
    $proposals_arr["proposal"] = array();

    if($rowCount > 0)
    {
      while($row = $stmt->fetch(PDO::FETCH_ASSOC))
      {
        $BidderID = $row['BidderID'];

        $bidder_arr = array();
        $bidderName = "";
        if(isset($BidderID))
        {
          $bidder = new Bidder($db);
          $bidder->selectByBidderID($BidderID);
          $bidderName = $bidder->first_name . " " . $bidder->last_name;
        }

        $proposal_arr = array(
          "ProposalID" =>  $row['ProposalID'],
          "OpportunityID" =>  $row['OpportunityID'],
          "BidderID" =>  $row['BidderID'],
          "Status" =>  $row['Status'],
          "StatusName" =>  $row['StatusName'],
          "TechnicalScore" =>  $row['TechnicalScore'],
          "FeeScore" =>  $row['FeeScore'],
          "FinalTotalScore" =>  $row['FinalTotalScore'],
          "CreatedDate" =>  $row['CreatedDate'],
          "LastEditDate" =>  $row['LastEditDate'],
          "BidderName" =>  $bidderName,
          "ContractAwarded" => $row['ContractAwarded'],
          "Fee" => $row['Fee']
          );

        array_push($proposals_arr["proposal"], $proposal_arr);
      }
    }

    // make it json format
    print_r(trim(json_encode($proposals_arr)));
  }
  else
  {
    //Search
    $stmt = $proposal->selectAll();
    $rowCount = $stmt->rowCount();

    $proposals_arr = array();
    $proposals_arr["proposal"] = array();

    if($rowCount > 0)
    {

      while($row = $stmt->fetch(PDO::FETCH_ASSOC))
      {
        $bidder_arr = array();

        $BidderID = $row['BidderID'];
        $bidderName = "";
        if(isset($BidderID))
        {
          $bidder = new Bidder($db);
          $bidder->selectByBidderID($BidderID);
          $bidderName = $bidder->first_name . " " . $bidder->last_name;
        }

        $proposal_arr = array(
          "ProposalID" =>  $row['ProposalID'],
          "OpportunityID" =>  $row['OpportunityID'],
          "BidderID" =>  $row['BidderID'],
          "Status" =>  $row['Status'],
          "StatusName" =>  $row['StatusName'],
          "TechnicalScore" =>  $row['TechnicalScore'],
          "FeeScore" =>  $row['FeeScore'],
          "FinalTotalScore" =>  $row['FinalTotalScore'],
          "CreatedDate" =>  $row['CreatedDate'],
          "LastEditDate" =>  $row['LastEditDate'],
          "BidderName" =>  $bidderName,
          "ContractAwarded" => $row['ContractAwarded'],
          "Fee" => $row['Fee']
          );
     
        array_push($proposals_arr["proposal"], $proposal_arr);
      }
    }

    // make it json format
    print_r(trim(json_encode($proposals_arr)));

    //echo '{';
    //echo ' "message" : "Read Succeeded."';
    //echo '}';

  }
}
?>