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
  public $StatusName;
  public $CategoryID;
  public $CreatedDate;
  public $LastEditDate;
  public $MinimumScore;

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByID($id)
  {
    $query = "select OpportunityID, ClosingDate, LeadEvaluatorID, O.Name, LowestBid, Description, O.Status, OS.Name as StatusName, CategoryID, CreatedDate, LastEditDate, MinimumScore from Opportunity O
  left join OppStatus OS on OS.StatusID = O.`Status` WHERE OpportunityID = ? ;";
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
    $this->StatusName = $row['StatusName'];
    $this->CategoryID = $row['CategoryID'];
    $this->CreatedDate = $row['CreatedDate']; 
    $this->LastEditDate = $row['LastEditDate'];
    $this->MinimumScore = $row['MinimumScore'];
  }

  // select one by ID
  function selectByCategoryID($CategoryID)
  {
    $query = "select OpportunityID, ClosingDate, LeadEvaluatorID, O.Name, LowestBid, Description, O.Status, OS.Name as StatusName, CategoryID, CreatedDate, LastEditDate, MinimumScore from Opportunity O
  left join OppStatus OS on OS.StatusID = O.`Status` WHERE CategoryID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $CategoryID);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select one by ID
  function selectByStatusID($StatusID)
  {
    $query = "select OpportunityID, ClosingDate, LeadEvaluatorID, O.Name, LowestBid, Description, O.Status, OS.Name as StatusName, CategoryID, CreatedDate, LastEditDate, MinimumScore from Opportunity O
  left join OppStatus OS on OS.StatusID = O.`Status` WHERE `Status` = ? ;";
    $stmt = $this->conn->prepare( $query );

    //echo "query = " . $query;

    // bind parameters
    $stmt->bindParam(1, $StatusID);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select All in the table
  function selectAll()
  {
    $query = "select OpportunityID, ClosingDate, LeadEvaluatorID, O.Name, LowestBid, Description, O.Status, OS.Name as StatusName, CategoryID, CreatedDate, LastEditDate, MinimumScore from Opportunity O
  left join OppStatus OS on OS.StatusID = O.`Status`;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  function update()
  {
    $query = "UPDATE Opportunity set ClosingDate = :ClosingDate, LeadEvaluatorID = :LeadEvaluatorID, Name = :Name, LowestBid = :LowestBid, Description = :Description, Status = :Status, LastEditDate = NOW(), CategoryID = :CategoryID, MinimumScore = :MinimumScore  WHERE OpportunityID = :OpportunityID;";

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
    $stmt->bindParam(':MinimumScore', $this->MinimumScore);
    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    $query = "INSERT INTO Opportunity (OpportunityID, ClosingDate, LeadEvaluatorID, Name, LowestBid, Description, Status, CategoryID, CreatedDate, LastEditDate, MinimumScore) " .
             "VALUES(:OpportunityID, :ClosingDate, :LeadEvaluatorID, :Name, :LowestBid, :Description, :Status, :CategoryID, NOW(), NOW(), :MinimumScore);";
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
    $stmt->bindParam(':MinimumScore', $this->MinimumScore);
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

      $query = "INSERT INTO ScoringCriteriaBlob (OpportunityID, ScoringCategoryBlob, MimeType, size, filename) VALUES (:OpportunityID, :fileData, :MimeType, :size, :filename)";
      
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
      $query = "SELECT OpportunityID, ScoringCategoryBlob, MimeType, size, filename FROM ScoringCriteriaBlob WHERE OpportunityID = '" . $OpportunityID . "' ;";
      

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
      $query = "INSERT INTO DocTemplate (DocTemplateID, DocTitle, DisplayTitle, Path, Url, CreatedDate, LastEditDate, PostedDate) VALUES (:DocTemplateID, :DocTitle, :DisplayTitle, :Path, :Url, NOW(), NOW(), NOW())";
      
      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(':DocTemplateID', $DocTemplateID);
      $stmt->bindParam(':DocTitle', $DocTitle);
      $stmt->bindParam(':DisplayTitle', $DocTitle);
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

  // Upload Scoring Criteria as a file. 
  function UploadScoringCriteria($SCID, $OpportunityID, $DocTitle, $Path, $Url)
  { 
    try
    {
      $query = "INSERT INTO ScoringCriteria (SCID, OpportunityID, DocTitle, DisplayTitle, Path, Url, CreatedDate, LastEditDate, PostedDate) VALUES (:SCID, :OpportunityID, :DocTitle, :DisplayTitle, :Path, :Url, NOW(), NOW(), NOW())";
      
      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(':SCID', $SCID);
      $stmt->bindParam(':OpportunityID', $OpportunityID);
      $stmt->bindParam(':DocTitle', $DocTitle);
      $stmt->bindParam(':DisplayTitle', $DocTitle);
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

  // Upload Scoring Criteria as a file. 
  function UpdateScoringCriteria($OpportunityID, $DocTitle, $DisplayTitle)
  { 
    try
    {
      $query = "UPDATE ScoringCriteria set LastEditDate = NOW()";

      if(isset($DocTitle))
      {
        $query = $query . ", DocTitle = '" . $DocTitle . "'";      
      }

      if(isset($DisplayTitle))
      {
        $query = $query . ", DisplayTitle = '" . $DisplayTitle . "'";      
      }

      $query = $query . " WHERE OpportunityID = '" . $OpportunityID . "';";
      
      $stmt = $this->conn->prepare( $query );
   
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
  function ScoringCriteriaExists($OpportunityID)
  { 
    try
    {
      $results = false;   

      $query = "SELECT count(*) as rowcount FROM ScoringCriteria WHERE OpportunityID = ? ; ";
      
      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(1, $OpportunityID);

      if($stmt->execute())
      {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if(!is_null($row['rowcount']))
        {
          $rowcount = $row['rowcount'];

          if($rowcount > 0)
            $results = true;
        }
      }

      return $results;
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
      $query = "SELECT DocTemplate.DocTemplateID, DocTitle, DisplayTitle, Path, Url, PostedDate, SortOrder ";
      $query = $query . "FROM DocTemplate "; 
      $query = $query . "INNER JOIN OppDocTemplate ODT ON ODT.DocTemplateID = DocTemplate.DocTemplateID ";
      $query = $query . "
WHERE OpportunityID = ? ; ";

      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(1, $OpportunityID);
      $stmt->execute();

      return $stmt;
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
    }
  }

  // Upload Document Template 
  function getScoringCriteria($OpportunityID)
  { 
    try
    {
      $query = "SELECT SCID, PostedDate, DocTitle, DisplayTitle, Path, Url FROM ScoringCriteria WHERE OpportunityID = ? ;";
      
      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(1, $OpportunityID);
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
  function getNewSCID()
  { 
    $SCID = 0;
    try
    {
      $query = "SELECT max(SCID) + 1 as newid FROM ScoringCriteria; ";
      

      $stmt = $this->conn->prepare( $query );
   
      if($stmt->execute())
      {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
      
        if(!is_null($row['newid']))
          $SCID = $row['newid'];
      }
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
    }

    return $SCID;
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

  // Get Dropdown List Data for Opportunity Status
  function getOppStatusList()
  {
    $query = "SELECT StatusID, Name FROM OppStatus;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select one by ID
  function getProposalCount($OpportunityID)
  {
    $Count = 0;
    try
    {
      $query = "select count(*) as ProposalCount from Proposal where OpportunityID = ?;";
      
      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(1, $OpportunityID);

      if($stmt->execute())
      {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $Count = $row['ProposalCount'];
      }
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
    }

    return $Count;
  }
}
?>