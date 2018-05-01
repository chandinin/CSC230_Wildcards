<?php
/**
 * Class: DocTemplate
 * Description: This is the database wrapper for retrieving the
 *              DocTemplate record from the database.
 */
class DocTemplate
{
  private $conn;
  public $DocTemplateID;
  public $DocTitle;
  public $Path;
  public $Blob;
  public $DisplayTitle; 
  public $PostedDate;

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByOppID($opportunityID)
  {
    $query = "select DocTemplateID, DocTitle, `Path`, `Blob`, PostedDate from DocTemplate where DocTemplateID in (select DocTemplateID from OppDocTemplate where OpportunityID = ? );";

//echo $query;
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $opportunityID);

    // execute query
    $stmt->execute();
    return $stmt;
  }

  // select one by ID
  function selectByDocTemplateID($DocTemplateID)
  {
    $query = "SELECT DocTemplateID, DocTitle, `Path`, `Blob`, DisplayTitle, PostedDate FROM DocTemplate WHERE DocTemplateID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $DocTemplateID);

    // execute query
    $stmt->execute();

    // get retrieved row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // set values to object properties
    $this->DocTemplateID = $row['DocTemplateID'];
    $this->DocTitle = $row['DocTitle'];
    $this->Path = $row['Path'];
    $this->Blob = $row['Blob'];
    $this->DisplayTitle = $row['DisplayTitle'];
    $this->PostedDate = $row['PostedDate'];
  }

  // select one by ID
  function searchByTitle($DocTitle)
  {   
    $query = "SELECT DocTemplateID, DocTitle, `Path`, `Blob`, DisplayTitle, PostedDate FROM DocTemplate WHERE DocTitle like '%".$DocTitle."%' ;";    
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();
    return $stmt;
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT DocTemplateID, DocTitle, `Path`, `Blob`, DisplayTitle, PostedDate FROM DocTemplate;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();
    return $stmt;
  }

  function update()
  {
    //$query = "UPDATE DocTemplate set DocTitle = :DocTitle, `Path` = :Path, `Blob` = :Blob, DisplayTitle = :DisplayTitle, LastEditDate=NOW() WHERE DocTemplateID = :DocTemplateID;";

    //$stmt = $this->conn->prepare( $query );

    // bind parameters
    //$stmt->bindParam(':DocTemplateID', $this->DocTemplateID);
    //$stmt->bindParam(':DocTitle', $this->DocTitle);
    //$stmt->bindParam(':Path', $this->Path);
    //$stmt->bindParam(':Blob', $this->Blob);
    //$stmt->bindParam(':DisplayTitle', $this->DisplayTitle);

    $query = "LastEditDate = NOW()";
    if(isset($this->DocTitle))
    {
      if(strlen($query) > 0)
        $query = $query . ", ";
      $query = $query . "DocTitle = '" . $this->DocTitle . "'";      
    }

    if(isset($this->Path))
    {
      if(strlen($query) > 0)
        $query = $query . ", ";
      $query = $query . "Path = '" . $this->Path . "'";      
    }

    if(isset($this->Blob))
    {
      if(strlen($query) > 0)
        $query = $query . ", ";
      $query = $query . "Blob = " . $this->Blob . "";      
    }

    if(isset($this->DisplayTitle))
    {
      if(strlen($query) > 0)
        $query = $query . ", ";
      $query = $query . "DisplayTitle = '" . $this->DisplayTitle . "'";      
    }

    $query = "UPDATE DocTemplate set " . $query .  " WHERE DocTemplateID = " . $this->DocTemplateID . ";";


    $stmt = $this->conn->prepare( $query );


    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    //$query = "INSERT INTO DocTemplate (DocTemplateID, DocTitle, `Path`, `Blob`) " .
    //         "VALUES(:DocTemplateID, :DocTitle, :Path, :Blob);";
    $query = "INSERT INTO DocTemplate (DocTemplateID, DocTitle, `Path`, `Blob`, DisplayTitle, CreatedDate,
 LastEditDate,
 PostedDate) " .
             "VALUES(:DocTemplateID, :DocTitle, :Path, :Blob, :DisplayTitle, NOW(), NOW(), NOW());";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':DocTemplateID', $this->DocTemplateID);
    $stmt->bindParam(':DocTitle', $this->DocTitle);
    $stmt->bindParam(':Path', $this->Path);
    $stmt->bindParam(':Blob', $this->Blob);
    //$stmt->bindParam(':DisplayTitle', $this->DisplayTitle);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function delete()
  {
    try
    {
      $query = "DELETE FROM DocTemplate WHERE DocTemplateID = :DocTemplateID;";
      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(':DocTemplateID', $this->DocTemplateID);

      if($stmt->execute())
        return true;
      else
        return false;
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
      return false;
    }    
  }

  // Upload Document Template 
  function deleteOppDocTemplateByID($DocTemplateID)
  { 
    try
    {
      $query = "DELETE FROM OppDocTemplate WHERE DocTemplateID = :DocTemplateID; ";
      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(':DocTemplateID', $DocTemplateID);

      if($stmt->execute())
        return true;
      else
        return false;
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
      return false;
    }
  }

  function SetOrder($DocTemplateID, $Index)
  {
    $query = "UPDATE DocTemplate set SortOrder = :SortOrder WHERE DocTemplateID = :DocTemplateID;";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':DocTemplateID', $DocTemplateID);
    $stmt->bindParam(':SortOrder', $Index);

    if($stmt->execute())
      return true;
    else
      return false;
  }
}
?>
