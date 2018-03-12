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

echo $data;
if(json_last_error() === JSON_ERROR_NONE)
{
  $bidder->id = $data->id;
  $bidder->bidopsid = $data->bidopsid;
  $bidder->first_name =$data->first_name;
  $bidder->last_name = $data->last_name;
  $bidder->email = $data->email;
  $bidder->password = $data->password;
  $bidder->phone = $data->phone;
  $bidder->middle_init = $data->middle_init;
  $bidder->address = $data->address;
  $bidder->user_name = $data->user_name;  

  if($bidder->create())
  {  
    echo '{';
       echo ' message : "Create suceeded. "';
    echo '}';
  }
  else
  {
    echo '{';
       echo ' message : "Create json failed."';
    echo '}';
  }
}
else
// get bidderID from POST
{
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["bidderid"]))
  {
    $bidderID = $_POST_LowerCase["bidderid"];

    //Search
    $bidder->id = $bidderID;

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


    if($bidder->create())
    {  
       echo '{';
       echo ' message : "Create form  suceeded. "';
       echo '}';
    }
    else
    {
       echo '{';
       echo ' message : "Create form  failed."';
       echo '}';
    }
  }
  else
  { 
    echo '{';
    echo ' message : "Create  form failed."';
    echo '}'; 
  }
}
?>

