<?php

session_start();


function getLang() {
    return ($_REQUEST['l']) ? preg_replace("/[^A-Za-z0-9?!]/",'',$_REQUEST['l']) : 'en';
}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>Yu-Gi-Oh! TRADING CARD GAME</title>
<script LANGUAGE="JavaScript">
<!--



// -->
</script>
<style media="screen" type="text/css">
    label { display: block; width: 100px; }
</style>
</head>
<body style="font: normal .80em/2em 'trebuchet ms', arial, sans-serif;" onload="setLang('<?php echo getLang(); ?>')">
<br />  
<style> 
div {
    width: 980px;
    margin: auto;
    
}
</style>
<div  > 
    <div  align="left"> 
        <tr >  
<?php
  include ("includes/test_db_yugioh.php");


      $i = 1;
      //CHANGE THE VERSION NUM HERE TO GET THE LATEST TEST
      mysql_query("SET NAMES 'utf8'"); //correct encoding. (question marks issue)
      $result = mysql_query("SELECT * FROM questions WHERE version_num = 1.0 AND test_name='rulings' ORDER BY id");


      while ($row = mysql_fetch_array($result)){
        echo "<b>" . $i . "</b>" . ".&nbsp;&nbsp;" . $row['question'] . "<br>";
        echo "<input type='hidden' name='question[]' value='" . $row['id'] . "'> ";

        $j = 1;
        $a_result = mysql_query("SELECT * FROM answers where question_id='".$row['id']."' ORDER BY id");
        while ($a_row = mysql_fetch_array($a_result)){
            //if ($row['correct_answer_id'] == $a_row['id'])
                //echo "<b>";

            echo "<input type='radio' name='answer[".$row['id']."]' value='".$a_row['id']."'>";
            echo "&nbsp;&nbsp;" . $a_row['answer'];

            //if ($row['correct_answer_id'] == $a_row['id'])
                //echo "-";

            echo "<br>";
            $j++;
        }
        echo "<br>";
        $i++;
      }
?>
    </tr>
</div>
</div>
	

</body>
</html>



