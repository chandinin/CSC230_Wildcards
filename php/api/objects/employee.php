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
    $query = "SELECT id, first_name, last_name, email, password, phone, " .
             "middleinitial, address, username, er.Role as RoleID, r.Name as Role FROM EMPLOYEE
        " .
                         "left join EmployeeRole er on EMPLOYEE.ID = er.EID ".
                         "left join Roles r on er.Role = r.RoleID;";


    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select All in the table
  function selectByRole($Role)
  {
    $query = "SELECT id, first_name, last_name, email, password, phone, " .
             "middleinitial, address, username, er.Role as RoleID, r.Name as Role FROM EMPLOYEE
        " .
                         "left join EmployeeRole er on EMPLOYEE.ID = er.EID ".
                         "left join Roles r on er.Role = r.RoleID WHERE Role = :Role;";


    $stmt = $this->conn->prepare( $query );
    $stmt->bindParam(':Role', $Role);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  function update()
  {
    //$query = "UPDATE EMPLOYEE set first_name = :first_name, last_name = :last_name, email =:email, password = :password, phone = :phone, middleinitial = :middleinitial, address = :address, username = :username WHERE id = :id;";

    $query = "UPDATE EMPLOYEE set ";
    $query = $query . "LastEditDate=NOW()";
    if(isset($this->first_name))
    {
      $query = $query . ", first_name = '" . $this->first_name . "'";
    }

    if(isset($this->last_name))
    {
      $query = $query . ", last_name = '" . $this->last_name . "'";
    }

    if(isset($this->email))
    {
      $query = $query . ", email = '" . $this->email . "'";
    }

    if(isset($this->password))
    {
      $query = $query . ", password = '" . $this->password . "'";
    }

    if(isset($this->phone))
    {
      $query = $query . ", phone = '" . $this->phone . "'";
    }

    if(isset($this->middle_init))
    {
      $query = $query . ", middleinitial = '" . $this->middle_init . "'";
    }

    if(isset($this->address))
    {
      $query = $query . ", address = '" . $this->address . "'";
    }

    if(isset($this->user_name))
    {
      $query = $query . ", username = '" . $this->user_name . "'";
    }

    $query = $query . " WHERE id = '" . $this->id . "';";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    //$stmt->bindParam(':id', $this->id);
    //$stmt->bindParam(':first_name', $this->first_name);
    //$stmt->bindParam(':last_name', $this->last_name);
    //$stmt->bindParam(':email', $this->email);
    //$stmt->bindParam(':password', $this->password);
    //$stmt->bindParam(':phone', $this->phone);
    //$stmt->bindParam(':middleinitial', $this->middle_init);
    //$stmt->bindParam(':address', $this->address);
    //$stmt->bindParam(':username', $this->user_name);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    $query = "INSERT INTO EMPLOYEE (id, first_name, last_name, email, password, phone, middleinitial, address, username, CreatedDate, LastEditDate) " .
             "VALUES(:id, :first_name, :last_name, :email, :password, :phone, :middleinitial, :address, :username, NOW(), NOW());";
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

  // select one by ID
  function IsRoleExists($eid, $roleid)
  {
    $query = "SELECT COUNT(*) as total FROM EmployeeRole WHERE EID = :EID AND Role = :RoleID;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':EID', $eid);
    $stmt->bindParam(':RoleID', $roleid);

    // execute query
    $stmt->execute();

    // get retrieved row
    $rowCount = $stmt->rowCount();
    $roleCount = 0;
    if($rowCount > 0)
    {
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $roleCount = $row['total'];
    }

    //echo ' { "RoleCount" : "'. $roleCount .'", "rowCount" : "'. $rowCount .'" } ';

    if($roleCount > 0)
      return true;
    else
      return false;
  }

  function createEmployeeRole($EID, $RoleID)
  {
    $query = "INSERT INTO EmployeeRole (EID, Role, CreatedDate, LastEditDate) VALUES(:EID, :RoleID, NOW(), NOW());";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':EID', $EID);
    $stmt->bindParam(':RoleID', $RoleID);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function createEmployeeRoleProposal($EID, $ProposalID, $RoleID)
  {
    $query = "INSERT INTO EmployeeRole (EID, ProposalID, RoleID, CreatedDate, LastEditDate) " .
             "VALUES(:EID, :ProposalID, :RoleID, NOW(), NOW());";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':EID', $EID);
    $stmt->bindParam(':ProposalID', $ProposalID);
    $stmt->bindParam(':RoleID', $RoleID);

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

  // select All in the table
  function getRoles()
  {
    $query = "SELECT RoleID, Name FROM Roles;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select All in the table
  function getEmployeeRoles($EID)
  {
    $query = "select r.RoleID, r.`Name` RoleDescription from Roles r inner join EmployeeRole er on er.Role = r.RoleID where EID = :EID;";
    $stmt = $this->conn->prepare( $query );

    $stmt->bindParam(':EID', $EID);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  function removeEmployeeAllRoles($EID)
  {
    $query = "DELETE FROM EmployeeRole WHERE EID = :EID ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':EID', $EID);

    if($stmt->execute())
      return true;
    else
      return false;
  }
}
?>