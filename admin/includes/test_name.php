<select id = "sel" onchange = "window.location.href=this.options[this.selectedIndex].value">
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?v=0">Please select</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?v=<?php echo getVersion(); ?>&l=<?php echo getLang(); ?>&t=rulings">Rulings</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?v=<?php echo getVersion(); ?>&l=<?php echo getLang(); ?>&t=policy">Policy Comprehension</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?v=<?php echo getVersion(); ?>&l=<?php echo getLang(); ?>&t=demojudge">Demo Judge</option>
  </select>
  <?php
    if (reqTest()=='rulings')
      $test = 'Rulings';
    else if (reqTest()=='policy')
      $test = 'Policy';
    else 
      $test = 'Demo Judge';
  ?>
  &nbsp;&nbsp;&nbsp;<font color="red">Test: <?php echo $test; ?></font>
