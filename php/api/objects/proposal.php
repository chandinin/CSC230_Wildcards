<?php
/**
 * Class: Proposal
 * Description: This is the database wrapper for retrieving the
 *              Proposal record from the database.
 */
//ini_set('display_errors', 'On');
//error_reporting(E_ALL);

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
  public $ContractAwarded;

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByID($id)
  {
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, ps.Name as StatusName, TechnicalScore, FeeScore, FinalTotalScore, ContractAwarded, CreatedDate, LastEditDate FROM Proposal p LEFT JOIN ProposalStatus ps ON ps.StatusID = p.Status WHERE ProposalID = ? ;";
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
    $this->ContractAwarded = $row['ContractAwarded'];
  }

  // select one by ID
  function selectByOppID($id)
  {
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, ps.Name as StatusName, TechnicalScore, FeeScore, FinalTotalScore, ContractAwarded, CreatedDate, LastEditDate FROM Proposal p LEFT JOIN ProposalStatus ps ON ps.StatusID = p.Status WHERE OpportunityID = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $id);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select one by ID
  function selectByOppIDStatus($id, $Status)
  {
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, ps.Name as StatusName, TechnicalScore, FeeScore, FinalTotalScore, ContractAwarded, CreatedDate, LastEditDate FROM Proposal p LEFT JOIN ProposalStatus ps ON ps.StatusID = p.Status WHERE OpportunityID = :OpportunityID and p.Status = :Status ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':OpportunityID', $id);
    $stmt->bindParam(':Status', $Status);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select one by ID
  function selectByStatus($Status)
  {
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, ps.Name as StatusName, TechnicalScore, FeeScore, FinalTotalScore, ContractAwarded, CreatedDate, LastEditDate FROM Proposal p INNER JOIN ProposalStatus ps ON ps.StatusID = p.Status WHERE p.Status = ? ;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $Status);

    // execute query
    $stmt->execute();

    return $stmt;
  }

  // select one by ID
  function AllPropsAcceptRejectByOppID($OpportunityID)
  {
    $AllRejectedAccepted = false;

    if($this->AllPropsAcceptRejectByOppIDEval2($OpportunityID))
    {      
      $AllRejectedAccepted = true;
      $this->SetOppStatus(5,$OpportunityID);
    }
    else if($this->AllPropsAcceptRejectByOppIDEval1($OpportunityID))
    {
      $AllRejectedAccepted = true;
      $this->SetOppStatus(4,$OpportunityID);
    }

    return $AllRejectedAccepted;
  }

  function SetOppStatus($Status, $OpportunityID)
  {
    $query = "UPDATE Opportunity set Status=:Status WHERE OpportunityID = :OpportunityID;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':Status', $Status);
    $stmt->bindParam(':OpportunityID', $OpportunityID);

    if($stmt->execute())
      return true;
    else
      return false;    
  }
  
  // select one by ID
  function AllPropsAcceptRejectByOppIDEval1($id)
  {
    $query = "select count(*) as total from Proposal where ((`Status` is null) OR (`Status` not in (10,15,60,65))) AND OpportunityID = :ID ;";
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

    if($proposalCount > 0)
      return false;
    else
      return true;
  }

  // select one by ID
  function AllPropsAcceptRejectByOppIDEval2($id)
  {
    $query = "select count(*) as total from Proposal where ((`Status` is null) OR (`Status` not in (60,65))) AND OpportunityID = :ID ;";
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

    if($proposalCount > 0)
      return false;
    else
      return true;
  }

  // Check technical score
  function Check($id)
  {
    $query = "select count(*) as total from Proposal where ((`Status` is null) OR (`Status` not in (60,65))) AND OpportunityID = :ID ;";
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

    if($proposalCount > 0)
      return false;
    else
      return true;
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, ps.Name as StatusName, TechnicalScore, FeeScore, FinalTotalScore, ContractAwarded, CreatedDate, LastEditDate FROM Proposal p LEFT JOIN ProposalStatus ps ON ps.StatusID = p.Status;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  function update()
  {
//    $query = "UPDATE Proposal set OpportunityID=:OpportunityID, BidderID=:BidderID, Status=:Status, TechnicalScore=:TechnicalScore, FeeScore=:FeeScore, FinalTotalScore=:FinalTotalScore, ContractAwarded=:ContractAwarded, LastEditDate=NOW() WHERE ProposalID = :ProposalID;";

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

    if(isset($this->ContractAwarded))
    {
      $query = $query . ", ContractAwarded = " . $this->ContractAwarded . " ";      
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
    $query = "UPDATE Proposal set Status=60 WHERE ProposalID = :ProposalID;";
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
    $query = "INSERT INTO Proposal (ProposalID, OpportunityID, BidderID, Status, TechnicalScore, FeeScore, FinalTotalScore, ContractAwarded, CreatedDate, LastEditDate) " .
             "VALUES(:ProposalID, :OpportunityID, :BidderID, :Status, :TechnicalScore, :FeeScore, :FinalTotalScore, :ContractAwarded, NOW(), NOW());";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':ProposalID', $this->ProposalID);
    $stmt->bindParam(':OpportunityID', $this->OpportunityID);
    $stmt->bindParam(':BidderID', $this->BidderID);

    if(isset($this->Status))
    {
      $stmt->bindParam(':Status', $this->Status);
    }
    else
    {
      $Status = 40; /* Default: Open - 40 */
      $stmt->bindParam(':Status', $Status);
    }
    $stmt->bindParam(':TechnicalScore', $this->TechnicalScore);
    $stmt->bindParam(':FeeScore', $this->FeeScore);
    $stmt->bindParam(':FinalTotalScore', $this->FinalTotalScore);
    $stmt->bindParam(':ContractAwarded', $this->ContractAwarded);

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
      $query = "INSERT INTO Docs (DocID, DocTitle, Path, Url, Description, SortOrder, CreatedDate, LastEditDate) VALUES (:DocID, :DocTitle, :Path, :Url, :Description, 0, NOW(), NOW())";


      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(':DocID', $DocID);
      $stmt->bindParam(':DocTitle', $DocTitle);
      $stmt->bindParam(':Description', $DocTitle);
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
      $query = "SELECT ProposalDocs.DocTemplateID, Docs.DocID, Docs.DocTitle, Docs.Description, Docs.CreatedDate, Docs.LastEditDate, Docs.Path, Docs.Url, Docs.SortOrder FROM Docs INNER JOIN ProposalDocs ON Docs.DocID=ProposalDocs.DocID WHERE ProposalDocs.ProposalID='".$ProposalID."' ";


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

  // Get Fee document for proposal
  function getFeeDocByProposalID($ProposalID)
  {
    try
    {
      $query = "SELECT ProposalDocs.DocTemplateID, Docs.DocID, Docs.DocTitle, Docs.Description, Docs.Path, Docs.Url, Docs.CreatedDate, Docs.LastEditDate, Docs.SortOrder FROM Docs INNER JOIN ProposalDocs ON Docs.DocID=ProposalDocs.DocID WHERE ProposalDocs.FeeDoc = 1 AND ProposalDocs.ProposalID='".$ProposalID."' ";


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

  // Get Fee document for proposal
  function removeFeeDocsByProposalID($ProposalID)
  {
    try
    {
      $query = "DELETE FROM ProposalDocs WHERE FeeDoc = 1 AND ProposalDocs.ProposalID='".$ProposalID."'; ";

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

  // Upload Document Template
  function RelateFeeDocsToProposalID($ProposalID, $DocsID, $ExpirationDate)
  {
    try
    {
      $query = "INSERT INTO ProposalDocs (ProposalID, DocID, ExpirationDate, FeeDoc, CreatedDate, LastEditDate) VALUES ('".$ProposalID."', ".$DocsID.", '".$ExpirationDate."', 1, NOW(), NOW()); ";

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

  function RelateFeeDocsToProposalID2($ProposalID, $DocsID, $ExpirationDate, $OpportunityID, $DocTemplateID)
  {
    try
    {
      $query = "INSERT INTO ProposalDocs (ProposalID, DocID, ExpirationDate, OpportunityID, DocTemplateID, FeeDoc, CreatedDate, LastEditDate) VALUES ('".$ProposalID."', ".$DocsID.", '".$ExpirationDate."', '".$OpportunityID."', ".$DocTemplateID.", 1, NOW(), NOW()); ";
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

  // Has Opportunity Expired?
  function HasOpportunityExpired($OpportunityID)
  {
    $isExpired = false;
    try
    {
      $query = "SELECT CASE WHEN NOW() > ClosingDate THEN 1 ELSE 0 END Expired FROM Opportunity WHERE OpportunityID = ? ; ";

      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(1, $OpportunityID);

      if($stmt->execute())
      {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $ExpiredFlag = $row['Expired'];

        if($ExpiredFlag > 0)
          $isExpired = true;
      }
    }
    catch (PDOException $e)
    {
      echo 'Connection failed: ' . $e->getMessage();
    }

    return $isExpired;
  }


  // Set Opportunity to Closed (Expired).
  function SetOpportunityStatusToClosed($OpportunityID)
  {
    try
    {
      $query = "UPDATE Opportunity SET Status = 6 WHERE OpportunityID = ? ; ";
      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(1, $OpportunityID);

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

<<<<<<< HEAD

=======
>>>>>>> c8ecde4793884de43a1268b5eea9b9b689a0ac8e
  // Reject All Proposals.
  function RejectAllProposals($OpportunityID)
  {
    try
    {
      $query = "UPDATE Proposal SET Status = 70 WHERE OpportunityID = ? ; ";
      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(1, $OpportunityID);

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

<<<<<<< HEAD
=======
  function getDocCount($ProposalID)
  {
    $Count = 0;
    try
    {
      $query = "select count(*) DocCount from ProposalDocs where ProposalID = ?; ";

      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(1, $ProposalID);

      if($stmt->execute())
      {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $Count = $row['DocCount'];
      }
    }
    catch (PDOException $e)
    {
      echo 'Connection failed: ' . $e->getMessage();
    }

    return $Count;
  }

  // Has Opportunity Expired?
  function setProposalStatus($ProposalID, $Status)
  {
    //Status: 70 - (Expired) , 30 - (In Progress)
    try
    {
      $query = "UPDATE Proposal SET Status = :Status WHERE ProposalID = :ProposalID ; ";
      $stmt = $this->conn->prepare( $query );

      // bind parameters
      $stmt->bindParam(":Status", $Status);
      $stmt->bindParam(":ProposalID", $ProposalID);

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
>>>>>>> c8ecde4793884de43a1268b5eea9b9b689a0ac8e
}
?>