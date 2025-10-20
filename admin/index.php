<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
  <?php
  // Date in the past
  header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
  // always modified
  header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
  // HTTP/1.1
  header("Cache-Control: no-store, no-cache, must-revalidate");
  header("Cache-Control: post-check=0, pre-check=0", false);
  // HTTP/1.0
  header("Pragma: no-cache");
  ?>
  <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
  <title>Yu-Gi-Oh! TRADING CARD GAME</title>

</head>

<body>
  <?php include("includes/functions.php"); ?>
  <table width="980" align="center">
    <tr>
      <td>
        <a href="http://www.konami.com/"><img src="../images/konami_logo.jpg" alt="KONAMI" border="0" /></a>
      </td>
    </tr>
    <tr>
      <td align="right">
        <?php include("includes/lang.php"); ?>
        <?php include("includes/version.php"); ?>
        <?php include("includes/test_name.php"); ?>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="../images/YGO_logo.jpg" alt="Yu-Gi-Oh! 5D's TRADING CARD GAME" />
      </td>
    </tr>
    <tr>
      <td>
        <table width="100%" border="1">
          <tr>
            <td>Name</td>
            <td>Cossy ID</td>
            <td>Email</td>
            <td>Score %</td>
            <td>Created</td>
          </tr>
          <?php
          include("includes/db_yugioh.php");
          $i = 1;
          if (isset($_REQUEST['v'])) {
            $version = $_REQUEST['v'];
          } else {
            $version = 1.0;
          }

          $result = $conn->query("SELECT * FROM result WHERE version_num=" . reqVersion() . " AND test_name='" . reqTest() . "' order by created desc limit 5000");
          while ($row = $result->fetch_array()) {
            echo "<tr ";
            if (intval($row['score']) > 79.99) echo "><td>";
            else echo "style='background-color: #b00000;'><td>";
            echo $row['first_name'] . " " . $row['last_name'] . "</td><td>" . $row['cid'] . "</td><td>" . $row['email'] . "</td><td>" . $row['score'] . "</td><td>" . $row['created'] . "</td></tr>";
            $i++;
          }
          ?>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" colspan="2">
        <br><br><img src="../images/YGOlegal.jpg" alt="Yu-Gi-Oh! 5D's TRADING CARD GAME" />
      </td>
    </tr>
  </table>
</body>

</html>


<?php

function answers($i)
{
  if ($i == "1")
    return "A";
  if ($i == "2")
    return "B";
  if ($i == "3")
    return "C";
  if ($i == "4")
    return "D";
  if ($i == "5")
    return "E";
}
?>