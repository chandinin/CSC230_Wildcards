<?php
/**
 * Created by PhpStorm.
 * User: cnagendra
 * Date: 3/2/2018
 * Time: 3:53 PM
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
    $sql = "INSERT INTO BIDDER 
    (ID, BIDOPSID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, PHONE )
    VALUES
    (1, 222333, 'JANE', 'SUMMERS', 'JANE@EMAIL.COM', '11221', 9167547785),
    (2, 897852, 'KATE', 'SUMMERS', 'KATE@EMAIL.COM', '55442', 9167547785);";

    // use exec() because no results are returned
    $connection->exec($sql);
    echo "Bidder table insert successful";
}
catch(PDOException $e)
{
    echo $sql . "<br>" . $e->getMessage();
}
$connection = null;
?>