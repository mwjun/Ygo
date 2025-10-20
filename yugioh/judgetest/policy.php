<?php
// ini_set('session.gc_maxlifetime', 1800);
//session_save_path("/home/users/web/b2704/glo.konamistorage/cgi-bin/tmp");
// session_start();
// will bounce the user if they've not visited an age-verify form
if (!isset($_COOKIE['legal'])) header('location: /judgetest/agegate.php?l=' . $language . '&test=policy');
// will bounce the user if not of age (
if ($_COOKIE['legal'] != 'yes') header('location: /judgetest/agegate.php?l=' . $language . '&test=policy');

function getLang()
{
  return ($_REQUEST['l']) ? preg_replace("/[^A-Za-z0-9?!]/", '', $_REQUEST['l']) : 'en';
}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
  <title>Yu-Gi-Oh! TRADING CARD GAME</title>
  <script LANGUAGE="JavaScript">
    <!--
    function validate_required(field, alerttxt) {
      with(field) {
        if (value == null || value == "") {
          alert(alerttxt);
          return false;
        } else {
          return true;
        }
      }
    }

    function validate_form(thisform) {
      with(thisform) {
        if (validate_required(email, "Email must be filled out!") == false) {
          email.focus();
          return false;
        }

        if (validate_required(fname, "First name must be filled out!") == false) {
          fname.focus();
          return false;
        }

        if (validate_required(lname, "Last name must be filled out!") == false) {
          lname.focus();
          return false;
        }

        if (validate_required(cid, "Cossy ID must be filled out!") == false) {
          cid.focus();
          return false;
        }
      }

      var agree = confirm("Are you sure you wish to submit?");
      if (agree)
        return true;
      else
        return false;
    }

    // 
    -->
    function
    setLang(lang)
    {
    var
    sel
    =
    document.getElementById('lang_select');
    var
    options
    =
    sel.options;
    for (var
    opt,
    j = 0;
    opt
    =
    options[j];
    j++)
    {
    if
    (opt.getAttribute('lang')
    ==
    lang)
    {
    sel.selectedIndex
    =
    j;
    break;
    }
    }
    }

  </script>
  <style media="screen" type="text/css">
    label {
      display: block;
      width: 100px;
    }
  </style>

</head>

<body style="font: normal .80em/2em 'trebuchet ms', arial, sans-serif;" onload="setLang('<?php echo getLang(); ?>')">
  <form name="myform" action="policy.php" onsubmit="return validate_form(this);" method="POST">
    <table width="980" align="center">
      <tr>
        <td>
          <a href="http://www.konami.com/"><img src="../images/konami_logo.jpg" alt="KONAMI" border="0" /></a>
          &nbsp;&nbsp;&nbsp;
          <font color="red">
            This test session expires in 30 minutes. The test must be completed within 30 minutes, or your results will only be processed up to that point.
          </font>
        </td>
      </tr>
      <tr>
        <td align="right">
          <div id="lang_select_wrap" style="float: right;">
            <label for="lang_select">Select Language:</label>
            <select name="lang_select" id="lang_select" onChange="document.location=this.value;">
              <option lang="en" value="/judgetest/policy.php?l=en">English</option>
              <option lang="sp" value="/judgetest/policy.php?l=sp">Spanish</option>
            </select>
          </div>

        </td>
      </tr>
      <tr>
        <td align="center">
          <img src="../images/YGO_logo.jpg" alt="Yu-Gi-Oh! 5D's TRADING CARD GAME" />
        </td>
      </tr>
      <tr>
        <td>
          <?php
          include("includes/db_yugioh.php");

          if ($_REQUEST['submit']) {
            $right = 0;
            $qa = "";
            foreach ($_POST['question'] as $key => $value) {

              $qa .= $conn->real_escape_string(htmlentities($value . ":" . $_POST['answer'][$value] . "-"));

              $a_result = $conn->query("SELECT * FROM questions where id = '" . $conn->real_escape_string(htmlentities($value)) . "' and correct_answer_id = '" . $conn->real_escape_string(htmlentities($_POST['answer'][$value])) . "'");
              if ($a_row = $a_result->fetch_array()) {
                $right++;
              }
            }

            $per = $right / 20 * 100;

            $conn->query("insert into result (email,score,qa,created,first_name,last_name,cid,version_num,test_name) values ('" . $conn->real_escape_string(htmlentities($_POST['email'])) . "'," . $per . ",'" . $qa . "',now(),'" . $conn->real_escape_string(htmlentities($_POST['fname'])) . "','" . $conn->real_escape_string(htmlentities($_POST['lname'])) . "','" . $conn->real_escape_string(htmlentities($_POST['cid'])) . "',1.0,'policy')");

            if ($per >= 80)
              echo "<h2>" . $per . "%</h2> Congratulations, you’ve passed the Policy Comprehension Level 1 (RC-1) test!
Your test results still need to be processed by a member of the Konami Judge Program team. 
An email will be sent to you within 2 weeks, confirming that you have passed this test.
For more information about the Konami Judge program, please visit: https://www.yugioh-card.com/en/judges/judge_FAQ.html
";
            else
              echo "<h2>" . $per . "%</h2> You did not pass the Policy Comprehension Level 1 (PC-1) test. 
Please study the Konami Official Tournament Policy documents (https://www.yugioh-card.com/en/events/organizedplay.html) before trying again.";
          } else {
          ?>
            <hr>
            <p>Please enter all of the following information. <br />
              Incomplete or inaccurate entries will not be accepted. </p>
            <p>
              <label for="email">E-mail Address:</label>
              <input type="text" name="email" />
            </p>
            <p>
              <label for="fname">First Name:</label>
              <input type="text" name="fname" />
            </p>
            <p>
              <label for="lname">Last Name:</label>
              <input type="text" name="lname" />
            </p>
            <p>
              <label for="cid">Cossy ID:</label>
              <input type="text" name="cid" />
            </p>

        </td>
      </tr>
      <tr>
        <td>

          <?php
            $i = 1;
            //CHANGE THE VERSION NUM HERE TO GET THE LATEST TEST
            $result = $conn->query("SELECT * FROM questions WHERE version_num = 1.0 AND test_name='policy' ORDER BY RAND() LIMIT 20");

            if ($result->num_rows >= 1) {
              while ($row = $result->fetch_array()) {
                echo "<b>" . $i . ".&nbsp;&nbsp;" . $row['question'] . "</b><br><br>";
                echo "<input type='hidden' name='question[]' value='" . $row['id'] . "'> ";

                $j = 1;
                $a_result = $conn->query("SELECT * FROM answers where question_id='" . $row['id'] . "' ORDER BY id");
                while ($a_row = $a_result->fetch_array()) {
                  //if ($row['correct_answer_id'] == $a_row['id'])
                  //echo "<b>";

                  echo "<input type='radio' name='answer[" . $row['id'] . "]' value='" . $a_row['id'] . "'>";
                  echo "&nbsp;&nbsp;" . $a_row['answer'];

                  //if ($row['correct_answer_id'] == $a_row['id'])
                  //echo "-";

                  echo "<br>";
                  $j++;
                }
                echo "<br>";
                $i++;
              }
          ?><!--
      <hr>
       <font color="red">
        This test session expires in 30 minutes.  The test must be completed within 30 minutes, or your results will only be processed up to that point.
        </font><br />
      <p>Please enter all of the following information. <br />
        Incomplete or inaccurate entries will not be accepted. </p>
      <p><br>
        E-mail Address:
        <input type="text" name="email" />
          <br>
          <br>
        First Name:
        <input type="text" name="fname" />
        <br>
          <br>
        Last Name:
        <input type="text" name="lname" />
        <br>
          <br>
        Cossy ID:
        <input type="text" name="cid" />
        <br>
        <br>
	-->
            <hr>
            <font color="red">
              Passing the Policy Comprehension Level 1 (PC-1) will NOT automatically enroll you in the Konami Judge Program.
            </font><br>
            <text>Please press Submit to submit your answers</text><br>
            <input type="hidden" name="l" value="<?php echo $language; ?>" />
            <input type="submit" value="Submit" name="submit" />
            <br><br>
        <?php
            } else {
              echo "Under Construction!";
            }
          }
        ?>
        </p>
        </td>
      </tr>
      <tr>
        <td align="center" colspan="2">
          <img src="../images/YGOlegal.jpg" alt="Yu-Gi-Oh! 5D's TRADING CARD GAME" />
        </td>
      </tr>
      <tr>
        <td align="center" colspan="2">
          <a href="https://www.yugioh-card.com/en/judges/">BACK TO JUDGE PROGRAM</a> | <a href="https://legal.konami.com/kdeus/privacy/en-us/">PRIVACY POLICY</a>
        </td>
      </tr>

    </table>
  </form>
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