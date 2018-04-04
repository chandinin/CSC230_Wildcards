<?php
/**
 * Class: Employee
 * Description: This is the database wrapper for retrieving the
 *              EMPLOYEE record from the database.
 */
class Employee
{
  private $conn;
  public $id;
  public $first_name;
  public $last_name;
  public $email;
  public $password;
  public $phone;
  public $middle_init;
  public $address;
  public $user_name;

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByID($eid)
  {
    $query = "SELECT id, first_name, last_name, email, password, phone, middleinitial, address, username FROM EMPLOYEE WHERE ID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $eid);

    // execute query
    $stmt->execute();

    // get retrieved row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // set values to object properties
    $this->id = $row['id'];
    $this->first_name = $row['first_name'];
    $this->last_name = $row['last_name'];
    $this->email = $row['email'];
    $this->password = $row['password'];
    $this->phone = $row['phone'];
    $this->middle_init = $row['middleinitial'];
    $this->address = $row['address'];
    $this->user_name = $row['username'];
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT id, first_name, last_name, email, password, phone, middleinitial, address, username FROM EMPLOYEE;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  function update()
  {
    $query = "UPDATE EMPLOYEE set first_name = :first_name, last_name = :last_name, email =:email, password = :password, phone = :phone, middleinitial = :middleinitial, address = :address, username = :username WHERE id = :id;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':id', $this->id);
    $stmt->bindParam(':first_name', $this->first_name);
    $stmt->bindParam(':last_name', $this->last_name);
    $stmt->bindParam(':email', $this->email);
    $stmt->bindParam(':password', $this->password);
    $stmt->bindParam(':phone', $this->phone);
    $stmt->bindParam(':middleinitial', $this->middle_init);
    $stmt->bindParam(':address', $this->address);
    $stmt->bindParam(':username', $this->user_name);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    $query = "INSERT INTO EMPLOYEE (id, first_name, last_name, email, password, phone, middleinitial, address, username) " .
             "VALUES(:id, :first_name, :last_name, :email, :password, :phone, :middleinitial, :address, :username);";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':id', $this->id);
    $stmt->bindParam(':first_name', $this->first_name);
    $stmt->bindParam(':last_name', $this->last_name);
    $stmt->bindParam(':email', $this->email);
    $stmt->bindParam(':password', $this->password);
    $stmt->bindParam(':phone', $this->phone);
    $stmt->bindParam(':middleinitial', $this->middle_init);
    $stmt->bindParam(':address', $this->address);
    $stmt->bindParam(':username', $this->user_name);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function delete()
  {
    $query = "DELETE FROM EMPLOYEE WHERE id = :id;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':id', $this->id);

    if($stmt->execute())
      return true;
    else
      return false;
  }
}
?>

