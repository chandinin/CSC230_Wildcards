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
  public $TechnicalScore;
  public $FeeScore;
  public $FinalTotalScore;

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByID($id)
  {
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, TechnicalScore, FeeScore, FinalTotalScore FROM Proposal WHERE ProposalID = ? ;";
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
    $this->TechnicalScore = $row['TechnicalScore'];
    $this->FeeScore = $row['FeeScore'];
    $this->FinalTotalScore = $row['FinalTotalScore'];
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT ProposalID, OpportunityID, BidderID, Status, TechnicalScore, FeeScore, FinalTotalScore FROM Proposal;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  function update()
  {
    $query = "UPDATE Proposal set OpportunityID=:OpportunityID, BidderID=:BidderID, Status=:Status, TechnicalScore=:TechnicalScore, FeeScore=:FeeScore, FinalTotalScore=:FinalTotalScore WHERE ProposalID = :ProposalID;";

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

  function create()
  {
    $query = "INSERT INTO Proposal (ProposalID, OpportunityID, BidderID, Status, TechnicalScore, FeeScore, FinalTotalScore) " .
             "VALUES(:ProposalID, :OpportunityID, :BidderID, :Status, :TechnicalScore, :FeeScore, :FinalTotalScore);";
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
}
?>

