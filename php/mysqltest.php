<?php
$servername = "athena";
$username = "wilddb_user";
$password = "wilddb_db";
$dbname = "wilddb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
 // Check connection
  if ($conn->connect_error) 
  {
    die("Connection failed: " . $conn->connect_error);
  }
  else
  {
    echo "Connection Succeeded!";
  } 

  echo "<br>";
 
  // sql to create table
  $sql = "SELECT first_name, last_name FROM BIDDER WHERE ID = 1;";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    echo "Read table employee successfully.<br><br>";
    echo "first name  last name<br>";
    echo "----------   --------<br>";
    while($row = $result->fetch_assoc()) 
    {
      echo $row["first_name"]. " " . $row["last_name"]. "<br>";
    }
  } else {
    echo "Error creating table: " . $conn->error;
  }

$conn->close();
?> 

