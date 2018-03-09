<?php
/**
 * Class: Database
 * By:   Dane Jew
 * Date: 3/5/2018
 *
 * Description: This is the wrapper for the database connection.
 */
class Database
{
  private $host = "athena";
  private $database = "wilddb";
  private $username = "wilddb_user";
  private $password = "wilddb_db";
  public $conn;

  public function Connect()
  {
    $this->conn = null;

    try
    {
      $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->database, $this->username, $this->password);
      $this->conn->exec("set names utf8");
    }
    catch(PDOException $exception)
    {
      echo "Connection error: " . $exception->getMessage();
    }
    return $this->conn;
  }
}
?>
