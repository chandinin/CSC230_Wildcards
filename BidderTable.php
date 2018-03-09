<?php
/**
 * Created by PhpStorm.
 * User: cnagendra
 * Date: 3/2/2018
 * Time: 2:54 PM
 */

$servername = "athena";
$username = "wilddb_user";
$password = "wilddb_db";
$dbname = "wilddb";

try {
    $connection = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //Create bidder table
    $sql = "CREATE TABLE BIDDER 
(
    ID INT NOT NULL PRIMARY KEY,
	BIDOPSID INT, 
    FIRST_NAME VARCHAR(30) NOT NULL,
	LAST_NAME VARCHAR(30),
    EMAIL VARCHAR(40) NOT NULL,
	PASSWORD VARCHAR(255) NOT NULL,
	PHONE INT 
);";

    // use exec() because no results are returned
    $connection->exec($sql);
    echo "Table Bidder created successfully";
}
catch(PDOException $e)
{
    echo $sql . "<br>" . $e->getMessage();
}
$connection = null;
?>