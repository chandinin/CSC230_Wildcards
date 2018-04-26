<?php
/**
 * Class: Clarification
 * Description: This is the database wrapper for retrieving the
 *              Clarification record from the database.
 */
class Clarification
{
  private $conn;
  public $ClarificationID;
  public $ProposalID;
  public $DocID;
  public $question;
  public $answer;
  public $CreatedDate;
  public $LastEditDate;
  public $ClosingDate;

  // Constructor
  // Note: Must pass connection as a parameter.
  public function __construct($db)
  {
    $this->conn = $db;
  }

  // select one by ID
  function selectByProposalID($proposalID)
  {
    //echo 'proposalID='.$proposalID;

    $query = "SELECT ClarificationID, ProposalID, DocID, question, answer, ClosingDate, CreatedDate, LastEditDate FROM Clarification where ProposalID = ?;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(1, $proposalID);

    // execute query
    $stmt->execute();
    return $stmt;
  }

  // select one by ID
  function selectByIDAndPropID()
  {
    $query = "SELECT ClarificationID, ProposalID, DocID, question, answer, ClosingDate, CreatedDate, LastEditDate FROM Clarification where ProposalID = :ProposalID AND ClarificationID = :ClarificationID;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':ClarificationID', $this->ClarificationID);
    $stmt->bindParam(':ProposalID', $this->ProposalID);

    // execute query
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $this->ClarificationID = $row['ClarificationID'];
    $this->ProposalID = $row['ProposalID'];
    $this->DocID =  $row['DocID'];
    $this->question =  $row['question'];
    $this->answer =  $row['answer'];
    $this->ClosingDate =  $row['ClosingDate'];
    $this->CreatedDate =  $row['CreatedDate'];
    $this->LastEditDate =  $row['LastEditDate'];
  }

  // select All in the table
  function selectAll()
  {
    $query = "SELECT ClarificationID, ProposalID, DocID, question, answer, ClosingDate, CreatedDate, LastEditDate FROM Clarification;";
    $stmt = $this->conn->prepare( $query );

    // execute query
    $stmt->execute();
    return $stmt;
  }

  function update()
  {
    $query = "UPDATE Clarification set DocID = :DocID, question = :question, answer = :answer, ClosingDate = :ClosingDate, LastEditDate = NOW() WHERE ProposalID = :ProposalID AND ClarificationID = :ClarificationID;";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':ClarificationID', $this->ClarificationID);
    $stmt->bindParam(':ProposalID', $this->ProposalID);
    $stmt->bindParam(':DocID', $this->DocID);
    $stmt->bindParam(':question', $this->question);
    $stmt->bindParam(':answer', $this->answer);
    $stmt->bindParam(':ClosingDate', $this->ClosingDate);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function create()
  {
    $query = "INSERT INTO Clarification (ClarificationID, ProposalID, DocID, question, answer, CreatedDate, LastEditDate, ClosingDate) " 
           . "VALUES (:ClarificationID, :ProposalID, :DocID, :question, :answer, NOW(), NOW(), :ClosingDate);";

    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':ClarificationID', $this->ClarificationID);
    $stmt->bindParam(':ProposalID', $this->ProposalID);
    $stmt->bindParam(':DocID', $this->DocID);
    $stmt->bindParam(':question', $this->question);
    $stmt->bindParam(':answer', $this->answer);
    $stmt->bindParam(':ClosingDate', $this->ClosingDate);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  function delete()
  {
    $query = "DELETE FROM Clarifications WHERE ClarificationID = :ClarificationID;";
    $stmt = $this->conn->prepare( $query );

    // bind parameters
    $stmt->bindParam(':ClarificationID', $this->ClarificationID);

    if($stmt->execute())
      return true;
    else
      return false;
  }

  // Upload Document Template 
  function getNewID($proposalID)
  { 
    $newID = 0;
    try
    {
      $query = "SELECT max(ClarificationID) + 1 as newid FROM Clarification WHERE ProposalID = ? ; ";
      
      $stmt = $this->conn->prepare( $query );
   
      // bind parameters
      $stmt->bindParam(1, $proposalID);

      if($stmt->execute())
      {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $newID = $row['newid'];
        if($newID ==  null)
          $newID = 0;
      }
    }
    catch (PDOException $e) 
    {
      echo 'Connection failed: ' . $e->getMessage();
    }

    return $newID;
  }
}
?>

