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

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  $BidderID = $data->id;
  $bidder->id = $BidderID;
  
  $bidder->selectByBidderID($BidderID);

  if(isset($data->bidopsid) and !is_null($data->bidopsid))
    $bidder->bidopsid = $data->bidopsid;
  if(isset($data->first_name) and !is_null($data->first_name))
    $bidder->first_name =$data->first_name;
  if(isset($data->last_name) and !is_null($data->last_name))
    $bidder->last_name = $data->last_name;
  if(isset($data->email) and !is_null($data->email))
    $bidder->email = $data->email;
  if(isset($data->password) and !is_null($data->password))
    $bidder->password = $data->password;
  if(isset($data->phone) and !is_null($data->phone))
    $bidder->phone = $data->phone;
  if(isset($data->middle_init) and !is_null($data->middle_init))
    $bidder->middle_init = $data->middle_init;
  if(isset($data->address) and !is_null($data->address))
    $bidder->address = $data->address;
  if(isset($data->user_name) and !is_null($data->user_name))
    $bidder->user_name = $data->user_name;  

  if($bidder->update())
  {  
    if(isset($data->subscription) and !is_null($data->subscription))
    {      
      $bidder->DeleteAllSubscriptions($BidderID);

      $Index = 0;
      $Subscriptions = $data->subscription;
      foreach($Subscriptions as $Subscription)
      { 
        $ID=$Subscription->ID;
        $CategoryID=$Subscription->CategoryID;
        if($bidder->Subscribe($ID, $CategoryID))
        {
        }
        else
        {
          echo '{';
          echo ' "ID" : "'.$ID.'"';
          echo ' "CategoryID" : "'.$CategoryID.'"';
          echo '}';
        }
        $Index = $Index + 1; 
      }
    }    
  }
  else
  {
    echo '{';
       echo ' message : "Update failed."';
    echo '}';
  }
}
// get bidderID from POST
else 
{
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["bidderid"]))
  {
    $bidderID = $_POST_LowerCase["bidderid"];

    //Search
    $bidder->selectByBidderID($bidderID);

    if(isSet($_POST_LowerCase["bidopsid"]))
    {
      $bidopsid = $_POST_LowerCase["bidopsid"];
      $bidder->bidopsid = $bidopsid;
    }

    if(isSet($_POST_LowerCase["first_name"]))
    {
      $first_name = $_POST_LowerCase["first_name"];
      $first_name = htmlspecialchars(strip_tags($first_name));
      $bidder->first_name =$first_name;
    }

    if(isSet($_POST_LowerCase["last_name"]))
    {
      $last_name = $_POST_LowerCase["last_name"];
      $last_name = htmlspecialchars(strip_tags($last_name));
      $bidder->last_name = $last_name;
    }

    if(isSet($_POST_LowerCase["email"]))
    {
      $email = $_POST_LowerCase["email"];
      $email = htmlspecialchars(strip_tags($email));
      $bidder->email = $email;
    }

    if(isSet($_POST_LowerCase["password"]))
    {
      $password = $_POST_LowerCase["password"];
      $password = htmlspecialchars(strip_tags($password));
      $bidder->password = $password;
    }

    if(isSet($_POST_LowerCase["phone"]))
    {
      $phone = $_POST_LowerCase["phone"];
      $phone = htmlspecialchars(strip_tags($phone));
      $bidder->phone = $phone;
    }

    if(isSet($_POST_LowerCase["middle_init"]))
    {
      $middle_init = $_POST_LowerCase["middle_init"];
      $middle_init = htmlspecialchars(strip_tags($middle_init));
      $bidder->middle_init = $middle_init;
    }

    if(isSet($_POST_LowerCase["address"]))
    {
      $address = $_POST_LowerCase["address"];
      $address = htmlspecialchars(strip_tags($address));
      $bidder->address = $address;
    }

    if(isSet($_POST_LowerCase["user_name"]))
    {
      $user_name = $_POST_LowerCase["user_name"];
      $user_name = htmlspecialchars(strip_tags($user_name));
      $bidder->user_name = $user_name;
    }

    if($bidder->update())
    {  
      echo '{';
      echo ' message : "Update suceeded. "';
      echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Update failed."';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "Bidder not found."';
    echo '}';
  }
}
?>
