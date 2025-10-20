<?php
include("includes/functions.php");
include("includes/version.php");
include("includes/lang.php");
include("includes/test_name.php");

include("includes/db_yugioh.php");

//$conn->query("update questions set question = 'Bobby has a face-up Attack Position \"Vanitys Fiend\", a face-up Attack Position \"Hyper Synchron\" and a Set Defense Position \"Krebons\" on his side of the Field. He has \"Destiny Hero Plasma\" and \"Polymerization\" in his hand, and \"Stardust Dragon\" in his Extra Deck. Which of the following can Bobby do?' where id = '11'");
//exit();

//$conn->query("update questions set correct_answer_id = '63' where id = '13'");
//exit();

if ($_REQUEST['q']) {
  $conn->query('INSERT INTO questions (question, version_num, test_name) VALUES("' . $_REQUEST['q'] . '", "1.0", "rulings") ');
  $id = $mysqli->insert_id();
  $co = $_REQUEST['c'];

  if ($id) {
    $conn->query('INSERT INTO answers (answer, question_id) VALUES("' . $_REQUEST['a1'] . '", ' . $id . ') ');
    if ($co == "1") $temp = $mysqli->insert_id();
    $conn->query('INSERT INTO answers (answer, question_id) VALUES("' . $_REQUEST['a2'] . '", ' . $id . ') ');
    if ($co == "2") $temp = $mysqli->insert_id();
    $conn->query('INSERT INTO answers (answer, question_id) VALUES("' . $_REQUEST['a3'] . '", ' . $id . ') ');
    if ($co == "3") $temp = $mysqli->insert_id();
    $conn->query('INSERT INTO answers (answer, question_id) VALUES("' . $_REQUEST['a4'] . '", ' . $id . ') ');
    if ($co == "4") $temp = $mysqli->insert_id();
    $conn->query('INSERT INTO answers (answer, question_id) VALUES("' . $_REQUEST['a5'] . '", ' . $id . ') ');
    if ($co == "5") $temp = $mysqli->insert_id();

    $conn->query("update questions set correct_answer_id = '" . $temp . "' where id = '" . $id . "'");

    echo '<br>';
    echo "Inserted " . $_REQUEST['q'] . "<br>";
  } else
    echo "Error";
}
echo (' .');



?>
<br />
<?php
include("header.php");
?>
<br />



<form name="input" action="admin.php" method="post">
  Questions:<TEXTAREA NAME="q" COLS=40 ROWS=6></TEXTAREA><br>
  Answer1:<TEXTAREA NAME="a1" COLS=40 ROWS=6></TEXTAREA><br>
  Answer2:<TEXTAREA NAME="a2" COLS=40 ROWS=6></TEXTAREA><br>
  Answer3:<TEXTAREA NAME="a3" COLS=40 ROWS=6></TEXTAREA><br>
  Answer4:<TEXTAREA NAME="a4" COLS=40 ROWS=6></TEXTAREA><br>
  Answer5:<TEXTAREA NAME="a5" COLS=40 ROWS=6></TEXTAREA><br>
  Correct Answer:<input type="text" name="c" />
  <input type="hidden" name="l" value="<?php echo $_REQUEST['l']; ?>" />
  <input type="submit" value="Submit" />
</form>

<?php


$i = 1;
$result = $conn->query("SELECT * FROM questions WHERE version_num='" . $_REQUEST['v'] . "' AND test_name='" . $_REQUEST['t'] . "' order by id ");
while ($row = $result->fetch_array()) {
  echo "<b>" . $i . "</b>:  " . $row['question'] . "<br>";

  $a_result = $conn->query("SELECT * FROM answers where question_id='" . $row['id'] . "'");
  while ($a_row = $a_result->fetch_array()) {
    if ($row['correct_answer_id'] == $a_row['id'])
      echo "<b>";

    echo $a_row['answer'];

    if ($row['correct_answer_id'] == $a_row['id'])
      echo "</b>";

    echo "<br>";
  }
  echo "<br>";
  $i++;
}
/*$conn->query("INSERT INTO questions (question) VALUES('Which of the following Phases do not exist in the Yu-Gi-Oh! Trading Card Game?') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Standby Phase', ".$id.") "); //1
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Recovery Phase', ".$id.") "); // *2
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Battle Phase', ".$id.") "); //3
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Draw Phase', ".$id.") ");  //4
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") ");  //5
  
  
  $conn->query("INSERT INTO questions (question, correct_answer_id) VALUES('Which of the following Steps do not exist in the Yu-Gi-Oh! Trading Card Game?', '6') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Draw Step', ".$id.") "); //* 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Battle Step', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('End Step', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Damage Step', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") "); // 10  
  
  $conn->query("INSERT INTO questions (question, correct_answer_id) VALUES('Which of the following is not a type of Spell Card in the Yu-Gi-Oh! Trading Card Game?', '15') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Quick-Play Spell Card', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Continuous Spell Card', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Equip Spell Card', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Field Spell Card', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") "); // *15  
  
  $conn->query("INSERT INTO questions (question, correct_answer_id) VALUES('How many cards do you begin with in your opening hand in the Yu-Gi-Oh! Trading Card Game?', '17') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('4', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('5', ".$id.") "); // *17
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('6', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('7', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") "); // 20 
  
  $conn->query("INSERT INTO questions (question, correct_answer_id) VALUES('What is the total amount of cards a player can have in his or her Main Deck?', '21') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('40 � 60', ".$id.") ");  // *21
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('40 � 80', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('60 � 80', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('40+', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") "); // 25
  
  $conn->query("INSERT INTO questions (question, correct_answer_id) VALUES('What is the name of the Deck where the Fusion Monsters that can be used during the current Duel are kept?', '26') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Extra Deck', ".$id.") ");  // *26
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Fusion Deck', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Main Deck', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Side Deck', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") "); // 30
  
  $conn->query("INSERT INTO questions (question, correct_answer_id) VALUES('What is the total amount of cards a player can have in his/her Side Deck?', '31') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('0 � 15', ".$id.") "); // *31  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('0 or 15', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('10', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('A Side Deck is not a Deck used in the Yu-Gi-Oh! Trading Card Game', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") "); // 35
  
  $conn->query("INSERT INTO questions (question, correct_answer_id) VALUES('Which part of a card is not related to gameplay?', '39') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Card name', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Level', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Attribute', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Card number', ".$id.") "); // *39 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") "); // 40
  
  $conn->query("INSERT INTO questions (question, correct_answer_id) VALUES('Which of the following is the Attribute on the following monster card?', '44') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Synchro', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Dragon', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Effect', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('WIND', ".$id.") "); // *44
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") "); // 45
  
  $conn->query("INSERT INTO questions (question, correct_answer_id) VALUES('Which of the following is not a type of Monster Effect in the Yu-Gi-Oh! Trading Card Game?', '50') "); 
  $id = $mysqli->insert_id();
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Quick Effect', ".$id.") ");  
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Trigger Effect', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Continuous Effect', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('Ignition Effect', ".$id.") "); 
  $conn->query("INSERT INTO answers (answer, question_id) VALUES('None of the above', ".$id.") "); // *50
  */

?>