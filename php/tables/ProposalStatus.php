<?php
/**
 * Created by PhpStorm.
 * User: cnagendra
 * Date: 3/18/2018
 * Time: 3:32 AM
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
    $sql = "CREATE TABLE ProposalStatus (
	[StatusId] INT NOT NULL,
	[Description] varchar(50) NOT NULL,
	CONSTRAINT [PK_ProposalStatus] PRIMARY KEY ([StatusId]),
	CONSTRAINT [FK_ProposalStatus_StatusId] FOREIGN KEY ([StatusId]) REFERENCES Proposal ([status])
);";
    // use exec() because no results are returned
    $connection->exec($sql);
    echo "Table ProposalStatus created successfully";
}
catch(PDOException $e)
{
    echo $sql . "<br>" . $e->getMessage();
}
$connection = null;
?>