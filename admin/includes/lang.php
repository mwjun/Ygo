  <select id = "sel" onchange = "window.location.href=this.options[this.selectedIndex].value">
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?l=us">Please select</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?l=us&v=<?php echo getVersion();?>&t=<?php echo getTest(); ?>">English</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?l=sp&v=<?php echo getVersion();?>&t=<?php echo getTest(); ?>">Spanish</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?l=de&v=<?php echo getVersion();?>&t=<?php echo getTest(); ?>">German</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?l=fr&v=<?php echo getVersion();?>&t=<?php echo getTest(); ?>">French</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?l=it&v=<?php echo getVersion();?>&t=<?php echo getTest(); ?>">Italian</option>
  </select>
  <?php
    if ($_REQUEST['l']=="sp")
      $dbname = 'Spanish';
    else if ($_REQUEST['l']=="de")
      $dbname = 'German';
    else if ($_REQUEST['l']=="fr")
      $dbname = 'French';
    else if ($_REQUEST['l']=="it")
      $dbname = 'Italian';
    else
      $dbname = 'English';
  ?>
  &nbsp;&nbsp;&nbsp;<font color="red">Language: <?php echo $dbname; ?></font>

