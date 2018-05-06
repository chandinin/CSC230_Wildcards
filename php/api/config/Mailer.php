<?php

class Mailer
{
  private $mailserver;
  private $headers;

  public function __construct()
  {
    $this->headers = "From: 'Wildcard'" . "\r\n" .
      "Reply-To: 'wildcard@ecs.csus.edu'";
  }


  public function SendMail($To, $Subject, $Body)
  {
    $headers = $this->headers;
    mail($To, $Subject, $Body, $headers);
  }
}

?>
