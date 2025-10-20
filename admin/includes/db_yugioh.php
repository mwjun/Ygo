<?php
$dbhost = 'localhost';
$dbuser = 'apphost';
#$dbuser = 'root';
#$dbpass = 'K0n@m1!2381';
#$dbhost = 'localhost';
$dbpass = 'L0c@l3!135';

#$dbhost = '172.16.100.12';
#  $dbuser = 'yugiohUserYru';
#  $dbpass = '$%&h452^^7ing*';
try {
	$language = (isset($_REQUEST['l'])) ? preg_replace("/[^A-Za-z0-9?!]/", '', $_REQUEST['l']) : 'en';

	$dbname = '2018_yugioh_test';

	if ($language == "sp")
		$dbname = 'yugioh_test_spanish';
	else if ($language == "de")
		$dbname = 'yugioh_test_de';
	else if ($language == "fr")
		$dbname = 'yugioh_test_fr';
	else if ($language == "it")
		$dbname = 'yugioh_test_it';
	else
		$dbname = '2018_yugioh_test';

	// $dbname = 'yugioh_test';
	// $conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	$conn  = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
	// $dbname = '2018_yugioh_test';
	// Check connection
	if ($conn->connect_errno) {
		echo "Failed to connect to MySQL: " . $mysqli->connect_error;
		exit();
	} else {
	}

	// @mysql_select_db($dbname) or die(mysql_error());
} catch (PDOException $e) {
	echo $e->getMessage();
}
