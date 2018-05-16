<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once "../config/Mailer.php";

date_default_timezone_set('America/Tijuana');

$To = null;
$From = null;
$Subject = null;
$Body = null;

$Mailer = new Mailer();

$data = json_decode(file_get_contents("php://input"));
if (json_last_error() === JSON_ERROR_NONE) {

  if(isset($data->To) && !is_null($data->To))
    $To = $data->To;
  if(isset($data->Subject) && !is_null($data->Subject))
    $Subject = $data->Subject;
  if(isset($data->Body) && !is_null($data->Body))
  {
    $Body = $data->Body;
  }
    
  $RecipientName = $To;
  $SenderName = $From;

  $message = "";
  $exception = null;
  try 
  {
    if(isset($Body) && !is_null($Body))
    {
      $Body = $Body . "\n\nThis message was sent by an automatic mailing system.";
      $Body = $Body . "  Do not reply to this email.";
    }

    $Mailer->SendMail($To, $Subject, $Body);
    $message = "Message sent.";
  } 
  catch (Exception $e) 
  {
    $message = "Message failed.";
    $exception = $e->getMessage();  
  }
    echo '{'; 
    echo '  "Message" : "' . $message . '"';

    if(isset($exception) && !is_null($exception))
      echo ' , "exception" : "' . $exception . '"';  

    echo ' , "To" : "' . $To . '"';
    echo ' , "From" : "' . $From . '"';
    echo ' , "Subject" : "' . $Subject . '"';
    echo ' , "Body" : "' . $Body . '"';
    echo '}';
}
else
{
  $_GET_lower = array_change_key_case($_GET, CASE_LOWER);
  $_POST_lower = array_change_key_case($_GET, CASE_LOWER);
  

  if(
     (isset($_POST_lower['to']) && isset($_POST_lower['subject']) && isset($_POST_lower['body']))
     || (isset($_GET_lower['to']) && isset($_GET_lower['subject']) && isset($_GET_lower['body']))

    )
  {
    if(isset($_GET_lower['to']) && !is_null($_GET_lower['to']))
      $To = $_GET_lower['to'];
    else
      $To = $_POST_lower['to'];

    if(isset($_GET_lower['from']) && !is_null($_GET_lower['from']))
      $From = $_GET_lower['from'];
    else
      $From = $_POST_lower['from'];

    if(isset($_GET_lower['subject']) && !is_null($_GET_lower['subject']))
      $Subject = $_GET_lower['subject'];
    else
      $Subject = $_POST_lower['subject'];

    if(isset($_GET_lower['body']) && !is_null($_GET_lower['body']))
      $Body = $_GET_lower['body'];
    else
      $Body = $_POST_lower['body'];

    $headers = "From: 'Wildcard'" . "\r\n" .
        "Reply-To: 'wildcard@ecs.csus.edu'";


    $RecipientName = $To;
    $SenderName = $From;
    
    $message = "";
    $exception = null;
    try
    {
      if(isset($Body) && !is_null($Body))
      {
        $Body = $Body . "\n\nThis message was sent by an automatic mailing system.";
        $Body = $Body . "  Do not reply to this email.";
      }

      $Mailer->SendMail($To, $Subject, $Body);
      $message = "Message sent.";
    }
    catch (Exception $e)
    {
      $message = "Message failed.";
      $exception = $e->getMessage();
    }
    echo '{';
    echo '  "Message" : "' . $message . '"';

    if(isset($exception) && !is_null($exception))
      echo ' , "exception" : "' . $exception . '"';

    echo ' , "To" : "' . $To . '"';
    echo ' , "From" : "' . $From . '"';
    echo ' , "Subject" : "' . $Subject . '"';
    echo ' , "Body" : "' . $Body . '"';
    echo '}';
  }
  else
  {
    echo '{';
    echo '  "Message" : "Failed to send email message!"';
    echo '  ,"Reason" : "You must have the following variables: To, From (Optional), Subject, Body."';
    echo '}';
  }

}

/* JSON Input: { "To" : "", "From" : "", "Subject" : "", "Body" : "" } */
?>
