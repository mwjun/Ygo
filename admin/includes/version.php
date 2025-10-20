<select id = "sel" onchange = "window.location.href=this.options[this.selectedIndex].value">
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?v=0">Please select</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?v=1.0&l=<?php echo getLang(); ?>&t=<?php echo getTest(); ?>">1.0</option>
  <option value="<?php echo $_SERVER["SCRIPT_NAME"]; ?>?v=2.0&l=<?php echo getLang(); ?>&t=<?php echo getTest(); ?>">2.0</option>
  </select>
  <?php
    if (reqVersion()==2.0)
      $version = '2.0';
    else
      $version= '1.0';
  ?>
  &nbsp;&nbsp;&nbsp;<font color="red">Test Level: <?php echo $version; ?></font>

