<?php
/**
 * Class: Bidder
 * By:   Dane Jew
 * Date: 3/5/2018
 *
 * Description: This is the database wrapper for retrieving the
 *              bidder record from the database.
 */
class Bidder
{
  private $conn;
  public $id;
  public $bidopsid;
  public $first_name;
  public $last_name;
  public $email;
  public $password;
  public $phone;

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  function selectByBidderID($bidderID)
  {
    $query = "SELECT id, bidopsid, first_name, last_name, email, password, phone FROM BIDDER WHERE ID = ? ;";

    // prepare query statement
    $stmt = $this->conn->prepare( $query );
 
    // bind id of product to be updated
    $stmt->bindParam(1, $bidderID);
 
    // execute query
    $stmt->execute();
 
    // get retrieved row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
 
    // set values to object properties
    $this->id = $row['id'];
    $this->bidopsid = $row['bidopsid'];
    $this->first_name = $row['first_name'];
    $this->last_name = $row['last_name'];
    $this->email = $row['email'];
    $this->password = $row['password'];
    $this->phone = $row['phone'];
  }



}
?>
