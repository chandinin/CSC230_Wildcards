<?php
/**
 * Class: Opportunity
 * Description: This is the database wrapper for retrieving the
 *              Opportunity record from the database.
 */
class Opportunity
{
  private $conn;
  public $OpportunityID;
  public $ClosingDate;
  public $ScoringCategoryBlob;
  public $LeadEvaluatorID;
  public $LowestBid;
  public $Description;


  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByID($id)
  {
    $query = "SELECT OpportunityID, ClosingDate, ScoringCategoryBlob, LeadEvaluatorID, LowestBid, Description FROM Opportunity WHERE OpportunityID = ? ;";
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
    $this->ScoringCategoryBlob = $row['ScoringCategoryBlob'];
    $this->LeadEvaluatorID = $row['LeadEvaluatorID'];
    $this->LowestBid = $row['LowestBid'];
    $this->Description = $row['Description'];
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT OpportunityID, ClosingDate, ScoringCategoryBlob, LeadEvaluatorID, LowestBid, Description FROM Opportunity;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();

    return $stmt;
  }

  function update()
  {
    $query = "UPDATE Opportunity set ClosingDate = :ClosingDate, ScoringCategoryBlob = :ScoringCategoryBlob, LeadEvaluatorID = :LeadEvaluatorID, LowestBid = :LowestBid, Description = :Description WHERE OpportunityID = :OpportunityID;";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':OpportunityID', $this->OpportunityID);
    $stmt->bindParam(':ClosingDate', $this->ClosingDate);
    $stmt->bindParam(':ScoringCategoryBlob', $this->ScoringCategoryBlob);
    $stmt->bindParam(':LeadEvaluatorID', $this->LeadEvaluatorID);
    $stmt->bindParam(':LowestBid', $this->LowestBid);
    $stmt->bindParam(':Description', $this->Description);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    $query = "INSERT INTO Opportunity (OpportunityID, ClosingDate, ScoringCategoryBlob, LeadEvaluatorID, LowestBid, Description) " .
             "VALUES(:OpportunityID, :ClosingDate, :ScoringCategoryBlob, :LeadEvaluatorID, :LowestBid, :Description);";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':OpportunityID', $this->OpportunityID);
    $stmt->bindParam(':ClosingDate', $this->ClosingDate);
    $stmt->bindParam(':ScoringCategoryBlob', $this->ScoringCategoryBlob);
    $stmt->bindParam(':LeadEvaluatorID', $this->LeadEvaluatorID);
    $stmt->bindParam(':LowestBid', $this->LowestBid);
    $stmt->bindParam(':Description', $this->Description);

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
}
?>

