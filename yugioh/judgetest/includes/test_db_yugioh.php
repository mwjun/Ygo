<?php
  $dbhost = '18.144.132.13';
  $dbuser = 'cyeung';
#$dbuser = 'root';
#$dbpass = 'K0n@m1!2381';
#$dbhost = 'localhost';
  $dbpass = 'LKjp98aid';

  #$dbhost = '172.16.100.12';
#  $dbuser = 'yugiohUserYru';
#  $dbpass = '$%&h452^^7ing*';

  $conn     = @mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql<br>'. mysql_error());
  $language = (isset($_REQUEST['l'])) ? preg_replace("/[^A-Za-z0-9?!]/",'',$_REQUEST['l']) : 'en'; 
  $dbname   = '2018_yugioh_test';

  if ($language=="sp")
    $dbname = 'yugioh_test_spanish';
  else if ($language=="de")
    $dbname = 'yugioh_test_de';
  else if ($language=="fr")
    $dbname = 'yugioh_test_fr';
  else if ($language=="it")
    $dbname = 'yugioh_test_it';
  else
    $dbname = '2018_yugioh_test';

  @mysql_select_db($dbname) or die (mysql_error());
?>
