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

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByOppID($opportunityID)
  {
    $query = "select DocTemplateID, DocTitle, `Path`, `Blob` from DocTemplate where DocTemplateID in (select DocTemplateID from OppDocTemplate where OpportunityID = ? );";

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
    $query = "SELECT DocTemplateID, DocTitle, `Path`, `Blob` FROM DocTemplate WHERE DocTemplateID = ? ;";
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
  }

  // select one by ID
  function searchByTitle($DocTitle)
  {   
    $query = "SELECT DocTemplateID, DocTitle, `Path`, `Blob` FROM DocTemplate WHERE DocTitle like '%".$DocTitle."%' ;";    
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();
    return $stmt;
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT DocTemplateID, DocTitle, `Path`, `Blob` FROM DocTemplate;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();
    return $stmt;
  }

  function update()
  {
    $query = "UPDATE DocTemplate set DocTitle = :DocTitle, `Path` = :Path, `Blob` = :Blob WHERE DocTemplateID = :DocTemplateID;";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':DocTemplateID', $this->DocTemplateID);
    $stmt->bindParam(':DocTitle', $this->DocTitle);
    $stmt->bindParam(':Path', $this->Path);
    $stmt->bindParam(':Blob', $this->Blob);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    $query = "INSERT INTO DocTemplate (DocTemplateID, DocTitle, `Path`, `Blob`) " .
             "VALUES(:DocTemplateID, :DocTitle, :Path, :Blob);";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':DocTemplateID', $this->DocTemplateID);
    $stmt->bindParam(':DocTitle', $this->DocTitle);
    $stmt->bindParam(':Path', $this->Path);
    $stmt->bindParam(':Blob', $this->Blob);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function delete()
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
}
?>


