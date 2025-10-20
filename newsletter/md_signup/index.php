<?php
  // ini_set('session.gc_maxlifetime', 7200);
//session_save_path("/home/users/web/b2704/glo.konamistorage/cgi-bin/tmp");
// session_start();
// will bounce the user if they've not visited an age-verify form
if(!isset($_COOKIE['legal'])) header('location: /newsletter/md_signup/agegate.php');
// will bounce the user if not of age (
if($_COOKIE['legal'] != 'yes') header('location: /newsletter/md_signup/agegate.php');

?>

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Sign Up for the Yu-Gi-Oh! MASTER DUEL Newsletter</title>
</head>

<body>


<p><img src="img/konami_logo.png" width="177" height="23" alt=""/></p>
<p><img src="img/MD_logo_225x110.png" width="225" height="112" alt=""/></p>
<iframe src="https://cdn.forms-content-1.sg-form.com/b0cde6b5-1866-11ef-b7eb-dea4d84223eb" style="border:none;" width="600px" height="600px"></iframe>   
<p>By signing up, you agree with our <a href="https://legal.konami.com/kdeus/privacy/en-us/">Privacy Policy</a> and <a href="https://legal.konami.com/kdeus/btob/terms/tou/en/">TERMS OF USE.</a></p>     
<p>NOTE:Newsletter Signups are only for residents of the United States and associated US territories at this time. Sorry for any inconvenience and stay tuned for future updates!</p>

<p>&nbsp;</p>
<p align="center"><img src="img/cr-digital.png" width="393" height="41" alt=""/></p>
<p>&nbsp;</p>
<p align="right">v 3.0.1</p>

</body>
</html>
