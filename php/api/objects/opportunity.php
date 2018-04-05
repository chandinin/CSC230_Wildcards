<?php
/**
 * Class: Opportunity
 * Description: This is the database wrapper for retrieving the
 *              Opportunity record from the database.
 */
ini_set('display_errors', 'On');
error_reporting(E_ALL);


class Opportunity
{
  private $conn;
  public $OpportunityID;
  public $ClosingDate;
  public $ScoringCategoryBlob;
  public $LeadEvaluatorID;
  public $Name;
  public $LowestBid;
  public $Description;
  public $Status;
  public $CategoryID;
  public $CreatedDate;
  public $LastEditDate;

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByID($id)
  {
    $query = "SELECT OpportunityID, ClosingDate, LeadEvaluatorID, Name, LowestBid, Description, Status, CategoryID, CreatedDate, LastEditDate FROM Opportunity WHERE OpportunityID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $id);

    // execute query
    $stmt->execute();

    // get retrieved row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // set values to object properties
    $this->OpportunityID = $row['OpportunityID'];
    $this->ClosingDate = $row['ClosingDate'];
    $this->LeadEvaluatorID = $row['LeadEvaluatorID'];
    $this->Name = $row['Name'];
    $this->LowestBid = $row['LowestBid'];
    $this->Description = $row['Description'];
    $this->Status = $row['Status'];
    $this->CategoryID = $row['CategoryID'];
    $this->CreatedDate = $row['CreatedDate']; 
    $this->LastEditDate = $row['LastEditDate'];
  }


  // select one by ID
  function selectByCategoryID($CategoryID)
  {
    $query = "SELECT OpportunityID, ClosingDate, LeadEvaluatorID, Name, LowestBid, Description, Status, CategoryID, CreatedDate, LastEditDate FROM Opportunity WHERE CategoryID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $CategoryID);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT OpportunityID, ClosingDate, LeadEvaluatorID, Name, LowestBid, Description, Status, CategoryID, CreatedDate, LastEditDate FROM Opportunity;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  function update()
  {
    $query = "UPDATE Opportunity set ClosingDate = :ClosingDate, LeadEvaluatorID = :LeadEvaluatorID, Name = :Name, LowestBid = :LowestBid, Description = :Description, Status = :Status, LastEditDate = NOW() WHERE OpportunityID = :OpportunityID;";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':OpportunityID', $this->OpportunityID);
    $stmt->bindParam(':ClosingDate', $this->ClosingDate);
    $stmt->bindParam(':LeadEvaluatorID', $this->LeadEvaluatorID);
    $stmt->bindParam(':Name', $this->Name);
    $stmt->bindParam(':LowestBid', $this->LowestBid);
    $stmt->bindParam(':Description', $this->Description);
    $stmt->bindParam(':Status', $this->Status);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    $query = "INSERT INTO Opportunity (OpportunityID, ClosingDate, LeadEvaluatorID, Name, LowestBid, Description, Status, CategoryID, CreatedDate, LastEditDate) " .
             "VALUES(:OpportunityID, :ClosingDate, :LeadEvaluatorID, :Name, :LowestBid, :Description, :Status, :CategoryID, NOW(), NOW());";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':OpportunityID', $this->OpportunityID);
    $stmt->bindParam(':ClosingDate', $this->ClosingDate);
    $stmt->bindParam(':LeadEvaluatorID', $this->LeadEvaluatorID);
    $stmt->bindParam(':Name', $this->Name);
    $stmt->bindParam(':LowestBid', $this->LowestBid);
    $stmt->bindParam(':Description', $this->Description);
    $stmt->bindParam(':Status', $this->Status);
    $stmt->bindParam(':CategoryID', $this->CategoryID);

    //$date = new DateTime(date("Y-m-d H:i:s"));
    //$stmt->bindParam(':CreatedDate', $date->format('Y-m-d H:i:s'));

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function delete()
  {
    $query = "DELETE FROM Opportunity WHERE OpportunityID = :OpportunityID;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':OpportunityID', $this->OpportunityID);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  // Get Category Dropdown Data
  function getCategories()
  {
    try
    {
      $query = "SELECT CategoryID, `Name` FROM OppCategory ORDER BY CategoryID;";
      $stmt = $this->conn->prepare( $query );
      $stmt->execute();

      return $stmt;
    }
    catch (PDOException $e)
    {
      echo 'Connection failed: ' . $e->getMessage();
    }
  }

  // Upload Blob File
  function UploadBlobByID($FilePath, $ID, $MimeType,
  $size,
  $filename)
  { 
    try
    {
      //$fileData = mysql_real_escape_string(file_get_contents($FilePath));
      //$fileData = file_get_contents($FilePath);
      $fileData = fopen($FilePath, 'rb');

      //$query = "UPDATE Opportunity set ScoringCategoryBlob = '" . $fileData . "' WHERE OpportunityID = '. $ID .'";
      //$query = "UPDATE Opportunity set ScoringCategoryBlob = '".LOAD_FILE($FilePath)."' WHERE OpportunityID = :OpportunityID;";
      //$query = "UPDATE Opportunity set ScoringCategoryBlob = :fileData WHERE OpportunityID = :OpportunityID;";

      $query = "INSERT INTO ScoringCriteriaBlob (OpportunityID,
 ScoringCategoryBlob,
  MimeType,
  size,
  filename) VALUES (:OpportunityID,
 :fileData,
  :MimeType,
  :size,
  :filename)";
      

      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(':OpportunityID', $ID);
      $stmt->bindParam(':fileData', $fileData, PDO::PARAM_LOB);
      $stmt->bindParam(':MimeType', $MimeType);
      $stmt->bindParam(':size', $size);
      $stmt->bindParam(':filename', $filename);

      if($stmt->execute())
        return true;
      else
        return false;
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
    }
  }

  // Upload Blob File
  function getBlobByID($OpportunityID)
  { 
    try
    {
      $query = "SELECT OpportunityID,
 ScoringCategoryBlob,
  MimeType,
  size,
  filename FROM ScoringCriteriaBlob WHERE OpportunityID = '" . $OpportunityID . "' ;";
      

      //echo $query;

      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      //$stmt->bindParam(':OpportunityID', $OpportunityID);

      $stmt->execute();
      
      return $stmt;
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
    }
  }

  // Upload Document Template 
  function UploadDocTemplate($DocTemplateID, $DocTitle, $Path, $Url)
  { 
    try
    {
      $query = "INSERT INTO DocTemplate (DocTemplateID, DocTitle, Path, Url) VALUES (:DocTemplateID, :DocTitle, :Path, :Url)";
      

      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(':DocTemplateID', $DocTemplateID);
      $stmt->bindParam(':DocTitle', $DocTitle);
      $stmt->bindParam(':Path', $Path);
      $stmt->bindParam(':Url', $Url);

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
  function UpdateDocTemplate($DocTemplateID, $DocTitle, $Path)
  { 
    try
    {
      $query = "UPDATE doctemplate set DocTitle = :DocTitle, Path = :Path WHERE DocTemplateID = :DocTemplateID; ";
      

      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(':DocTemplateID', $DocTemplateID);
      $stmt->bindParam(':DocTitle', $DocTitle);
      $stmt->bindParam(':Path', $Path);

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
  function DocTemplateExists($DocTemplateID, $DocTitle)
  { 
    try
    {
      $query = "SELECT count(*) FROM DocTemplate WHERE DocTemplateID = :DocTemplateID OR DocTitle like '" . $DocTitle . "'; ";
      

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

  // Upload Document Template 
  function getDocTemplates($OpportunityID)
  { 
    try
    {
      $query = "SELECT DocTemplateID, DocTitle, Path, Url FROM DocTemplate WHERE DocTemplateID in (SELECT DocTemplateID FROM OppDocTemplate WHERE OpportunityID = :OpportunityID) ";
      

      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(':OpportunityID', $OpportunityID);
      $stmt->execute();

      return $stmt;
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
    }
  }


  // Upload Document Template 
  function getNewDocTemplateID()
  { 
    $DocTemplateID = 0;
    try
    {
      $query = "SELECT max(DocTemplateID) + 1 as newid FROM DocTemplate; ";
      

      $stmt = $this->conn->prepare( $query );
   
      if($stmt->execute())
      {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $DocTemplateID = $row['newid'];
      }
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
    }

    return $DocTemplateID;
  }

  // Upload Document Template 
  function RelateDocTemplateToOppID($OpportunityID, $DocTemplateID, $ExpirationDate)
  { 
    try
    {
      $query = "INSERT INTO OppDocTemplate (OpportunityID, DocTemplateID, ExpirationDate) VALUES (:OpportunityID, :DocTemplateID, :ExpirationDate)";
      

      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(':OpportunityID', $OpportunityID);
      $stmt->bindParam(':DocTemplateID', $DocTemplateID);
      $stmt->bindParam(':ExpirationDate', $ExpirationDate);

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

  // select one by ID
  function getCategoryByID($CategoryID)
  {
    $query = "SELECT CategoryID, Name FROM OppCategory WHERE CategoryID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $CategoryID);

    // execute query
    $stmt->execute();

    return $stmt;
  }
}
?>

