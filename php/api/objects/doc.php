<?php
/**
 * Class: Doc
 * Description: This is the database wrapper for retrieving the
 *              Doc record from the database.
 */
class Doc
{
  private $conn;
  public $DocID;
  public $DocTitle;
  public $Path;
  public $Blob;
  public $Url;
  public $Description;
  public $CreatedDate;
  public $LastEditDate;
  public $SortOrder;

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByOppID($opportunityID)
  {
    $query = "select DocID, DocTitle, `Path`, `Blob`, Url, Description, CreatedDate, LastEditDate, SortOrder from Docs where DocID in (select DocID from ProposalDoc where ProposalID = ? );";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $opportunityID);

    // execute query
    $stmt->execute();
    return $stmt;
  }

  // select one by ID
  function selectByDocID($DocID)
  {
    $query = "SELECT DocID, DocTitle, `Path`, `Blob`, Url, Description, CreatedDate, LastEditDate, SortOrder FROM Docs WHERE DocID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $DocID);

    // execute query
    $stmt->execute();

    // get retrieved row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // set values to object properties
    $this->DocID = $row['DocID'];
    $this->DocTitle = $row['DocTitle'];
    $this->Path = $row['Path'];
    $this->Blob = $row['Blob'];
    $this->Url = $row['Url'];
    $this->Description = $row['Description'];
    $this->CreatedDate = $row['CreatedDate'];
    $this->LastEditDate = $row['LastEditDate'];
    $this->SortOrder = $row['SortOrder'];
  }

  // Upload Document Template 
  function DocExistsByID($DocID)
  { 
    try
    {
      $query = "SELECT count(*) as docCount FROM Docs WHERE DocID = :DocID; ";
      

      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(':DocID', $DocID);
      $count = 0;

      if($stmt->execute())
      {
        if($stmt->rowCount() > 0)
        {
          $row = $stmt->fetch(PDO::FETCH_ASSOC);
          $count = $row["docCount"];

          if($count > 0)
            return true;
          else
            return false;
        }
        else
          return false;
      }
      else
      {
        return false;
      }
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
      return false;
    }
  }


  // select one by ID
  function searchByTitle($DocTitle)
  {   
    $query = "SELECT DocID, DocTitle, `Path`, `Blob`, Url, Description, CreatedDate, LastEditDate, SortOrder FROM Docs WHERE DocTitle like '%".$DocTitle."%' ;";    
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();
    return $stmt;
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT DocID, DocTitle, `Path`, `Blob` FROM Docs;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();
    return $stmt;
  }

  function update()
  {
    $query = "UPDATE Docs set DocTitle = :DocTitle, `Path` = :Path, `Blob` = :Blob, Url = :Url, Description = :Description, SortOrder = :SortOrder, LastEditDate = NOW() WHERE DocID = :DocID;";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':DocID', $this->DocID);
    $stmt->bindParam(':DocTitle', $this->DocTitle);
    $stmt->bindParam(':Path', $this->Path);
    $stmt->bindParam(':Blob', $this->Blob);
    $stmt->bindParam(':Url', $this->Url);
    $stmt->bindParam(':Description', $this->Description);
    $stmt->bindParam(':SortOrder', $this->SortOrder);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    $query = "INSERT INTO Docs (DocID, DocTitle, `Path`, `Blob`, Description, Url, CreatedDate, LastEditDate, SortOrder) " .
             "VALUES(:DocID, :DocTitle, :Path, :Blob, :Description, :Url, NOW(), NOW(), 0);";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':DocID', $this->DocID);
    $stmt->bindParam(':DocTitle', $this->DocTitle);
    $stmt->bindParam(':Path', $this->Path);
    $stmt->bindParam(':Blob', $this->Blob);
    $stmt->bindParam(':Url', $this->Url);
    $stmt->bindParam(':Description', $this->Description);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function delete()
  {
    $query = "DELETE FROM Docs WHERE DocID = :DocID;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':DocID', $this->DocID);

    if($stmt->execute())
      return true;
    else
      return false;
  }
}
?>