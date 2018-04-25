<?php
/**
 * Class: Proposal
 * Description: This is the database wrapper for retrieving the
 *              Proposal record from the database.
 */
ini_set('display_errors', 'On');
error_reporting(E_ALL);

class Proposal
{
  private $conn;
  public $ProposalID;
  public $OpportunityID;
  public $BidderID;
  public $Status;
  public $StatusName;
  public $TechnicalScore;
  public $FeeScore;
  public $FinalTotalScore;
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
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, ps.Name as StatusName, TechnicalScore, FeeScore, FinalTotalScore, CreatedDate, LastEditDate FROM Proposal p LEFT JOIN ProposalStatus ps ON ps.StatusID = p.Status WHERE ProposalID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $id);

    // execute query
    $stmt->execute();

    // get retrieved row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // set values to object properties
    $this->ProposalID = $row['ProposalID'];
    $this->OpportunityID = $row['OpportunityID'];
    $this->BidderID = $row['BidderID'];
    $this->Status = $row['Status'];
    $this->StatusName = $row['StatusName'];
    $this->TechnicalScore = $row['TechnicalScore'];
    $this->FeeScore = $row['FeeScore'];
    $this->FinalTotalScore = $row['FinalTotalScore'];
    $this->CreatedDate = $row['CreatedDate'];
    $this->LastEditDate = $row['LastEditDate'];
  }

  // select one by ID
  function selectByOppID($id)
  {
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, ps.Name as StatusName, TechnicalScore, FeeScore, FinalTotalScore, CreatedDate, LastEditDate FROM Proposal p LEFT JOIN ProposalStatus ps ON ps.StatusID = p.Status WHERE OpportunityID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $id);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select one by ID
  function AllPropsAcceptRejectByOppID($id)
  {
    $query = "select count(*) as total from Proposal where ((`Status` is null) OR (`Status` <> 0 AND `Status` <> 1)) AND OpportunityID = :ID ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':ID', $id);

    // execute query
    $stmt->execute();

    // get retrieved row
    $rowCount = $stmt->rowCount();
    $proposalCount = 0;
    if($rowCount > 0)
    {
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $proposalCount = $row['total'];
    }

    //echo '{';
    //echo ' "id" : "' . $id . '",';
    //echo ' "itemcount" : "' . $rowCount . ',"';
    //echo ' "total" : "' . $proposalCount . ',"';
    //echo ' "query" : "' . $query . '"';
    //echo '}';   

    if($proposalCount > 0)
      return false;
    else
      return true;
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, ps.Name as StatusName, TechnicalScore, FeeScore, FinalTotalScore, CreatedDate, LastEditDate FROM Proposal p LEFT JOIN ProposalStatus ps ON ps.StatusID = p.Status;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  function update()
  {
//    $query = "UPDATE Proposal set OpportunityID=:OpportunityID, BidderID=:BidderID, Status=:Status, TechnicalScore=:TechnicalScore, FeeScore=:FeeScore, FinalTotalScore=:FinalTotalScore, LastEditDate=NOW() WHERE ProposalID = :ProposalID;";

    $query = "UPDATE Proposal set ";
    $query = $query . "LastEditDate=NOW()";
    if(isset($this->BidderID))
    {
      $query = $query . ", OpportunityID = '" . $this->OpportunityID . "'";      
    }

    if(isset($this->BidderID))
    {
      $query = $query . ", BidderID = '" . $this->BidderID . "'";      
    }

    if(isset($this->Status))
    {
      $query = $query . ", Status = " . $this->Status . "";      
    }

    if(isset($this->TechnicalScore))
    {
      $query = $query . ", TechnicalScore = " . $this->TechnicalScore . " ";      
    }

    if(isset($this->FeeScore))
    {
      $query = $query . ", FeeScore = " . $this->FeeScore . " ";      
    }

    if(isset($this->FinalTotalScore))
    {
      $query = $query . ", FinalTotalScore = " . $this->FinalTotalScore . " ";      
    }
    $query = $query . " WHERE ProposalID = '" . $this->ProposalID . "';";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    //$stmt->bindParam(':ProposalID', $this->ProposalID);
    //$stmt->bindParam(':OpportunityID', $this->OpportunityID);
    //$stmt->bindParam(':BidderID', $this->BidderID);
    //$stmt->bindParam(':Status', $this->Status);
    //$stmt->bindParam(':TechnicalScore', $this->TechnicalScore);
   // $stmt->bindParam(':FeeScore', $this->FeeScore);
    //$stmt->bindParam(':FinalTotalScore', $this->FinalTotalScore);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function reject($ProposalID)
  {
    $query = "UPDATE Proposal set Status=0 WHERE ProposalID = :ProposalID;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':ProposalID', $ProposalID);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    $query = "INSERT INTO Proposal (ProposalID, OpportunityID, BidderID, Status, TechnicalScore, FeeScore, FinalTotalScore, CreatedDate, LastEditDate) " .
             "VALUES(:ProposalID, :OpportunityID, :BidderID, :Status, :TechnicalScore, :FeeScore, :FinalTotalScore, NOW(), NOW());";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':ProposalID', $this->ProposalID);
    $stmt->bindParam(':OpportunityID', $this->OpportunityID);
    $stmt->bindParam(':BidderID', $this->BidderID);
    $stmt->bindParam(':Status', $this->Status);
    $stmt->bindParam(':TechnicalScore', $this->TechnicalScore);
    $stmt->bindParam(':FeeScore', $this->FeeScore);
    $stmt->bindParam(':FinalTotalScore', $this->FinalTotalScore);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function delete()
  {
    $query = "DELETE FROM Proposal WHERE ProposalID = :ProposalID;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':ProposalID', $this->ProposalID);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  // Upload Document Template
  function UploadDoc($DocID, $DocTitle, $Path, $Url)
  {
    try
    {
      $query = "INSERT INTO Docs (DocID, DocTitle, Path, Url, CreatedDate, LastEditDate) VALUES (:DocID, :DocTitle, :Path, :Url, NOW(), NOW())";


      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(':DocID', $DocID);
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

  // Upload Document 
  function DocExists($DocID, $DocTitle)
  {
    try
    {
      $query = "SELECT count(*) FROM Docs WHERE DocID = :DocID OR DocTitle like '" . $DocTitle . "'; ";


      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(':DocID', $DocID);

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
  function getDocByProposalID($ProposalID)
  {
    try
    {
      //$query = "SELECT DocID, DocTitle, Description, Path, Url FROM Docs WHERE DocID in (SELECT DocID FROM ProposalDocs WHERE ProposalID = '".$ProposalID."') ";
      $query = "SELECT ProposalDocs.DocTemplateID, Docs.DocID, Docs.DocTitle, Docs.Description, Docs.Path, Docs.Url FROM Docs INNER JOIN ProposalDocs ON Docs.DocID=ProposalDocs.DocID WHERE ProposalDocs.ProposalID='".$ProposalID."' ";


      $stmt = $this->conn->prepare( $query );

      // bind parameters
      //$stmt->bindParam(':ProposalID', $ProposalID);
      $stmt->execute();

      return $stmt;
    }
    catch (PDOException $e)
    {
      echo 'Connection failed: ' . $e->getMessage();
    }
  }

  // Upload Document Template
  function getNewDocID()
  {
    $DocID = 0;
    try
    {
      $query = "SELECT ifnull(max(DocID) + 1, 1) as newid FROM Docs; ";


      $stmt = $this->conn->prepare( $query );

      if($stmt->execute())
      {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $DocID = $row['newid'];
      }
    }
    catch (PDOException $e)
    {
      echo 'Connection failed: ' . $e->getMessage();
    }

    return $DocID;
  }

  // Upload Document Template
  function RelateDocsToProposalID($ProposalID, $DocsID, $ExpirationDate)
  {
    try
    {
      $query = "INSERT INTO ProposalDocs (ProposalID, DocID, ExpirationDate) VALUES ('".$ProposalID."', ".$DocsID.", '".$ExpirationDate."'); ";

      $stmt = $this->conn->prepare( $query );

      // bind parameters
      //$stmt->bindParam(':ProposalID', $ProposalID);
      //$stmt->bindParam(':DocID', $DocID);
      //$stmt->bindParam(':ExpirationDate', $ExpirationDate);

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

  function RelateDocsToProposalID2($ProposalID, $DocsID, $ExpirationDate, $OpportunityID, $DocTemplateID)
  {
    try
    {
      $query = "INSERT INTO ProposalDocs (ProposalID, DocID, ExpirationDate, OpportunityID, DocTemplateID, CreatedDate, LastEditDate) VALUES ('".$ProposalID."', ".$DocsID.", '".$ExpirationDate."', '".$OpportunityID."', ".$DocTemplateID.", NOW(), NOW()); ";
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

  function getOpportunityIDByProposalID($ProposalID)
  {
    $query = "SELECT OpportunityID FROM Proposal WHERE ProposalID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $ProposalID);

    // execute query
    $stmt->execute();

    // get retrieved row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // set values to object properties
    $OpportunityID = $row['OpportunityID'];

    return $OpportunityID;
  }

  // Get Dropdown List Data for Opportunity Status
  function getProposalStatusList()
  {
    $query = "SELECT StatusID, Name FROM ProposalStatus;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // Upload Document Template
  function getMinumumOppScore($OpportunityID)
  {
    $MinScore = 0;
    try
    {
      $query = "SELECT MinimumScore FROM Opportunity WHERE OpportunityID = ? ; ";


      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(1, $OpportunityID);

      if($stmt->execute())
      {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $MinScore = $row['MinimumScore'];
      }
    }
    catch (PDOException $e)
    {
      echo 'Connection failed: ' . $e->getMessage();
    }

    return $MinScore;
  }
}
?>


