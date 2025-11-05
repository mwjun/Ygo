<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sign Up for the Yu-Gi-Oh! MASTER DUEL Newsletter</title>
<link rel="stylesheet" href="../includes/style.css">
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'trebuchet ms', Arial, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
    padding: 20px;
    color: #333;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    overflow: hidden;
}

.header {
    background: linear-gradient(135deg, #b00000 0%, #8a0000 100%);
    padding: 30px;
    text-align: center;
}

.header img {
    max-width: 200px;
    height: auto;
    margin-bottom: 15px;
}

.logo-section {
    padding: 30px;
    text-align: center;
    background: #f8f8f8;
}

.logo-section img {
    max-width: 300px;
    height: auto;
}

.content {
    padding: 40px;
}

.form-container {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    margin: 30px 0;
    text-align: center;
}

.form-container iframe {
    border: 2px solid #ddd;
    border-radius: 8px;
    max-width: 100%;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.legal-text {
    margin: 30px 0;
    padding: 20px;
    background: #fff;
    border-left: 4px solid #b00000;
    border-radius: 4px;
    line-height: 1.8;
    font-size: 14px;
}

.legal-text a {
    color: #b00000;
    text-decoration: none;
    font-weight: bold;
}

.legal-text a:hover {
    text-decoration: underline;
}

.footer {
    background: #f8f8f8;
    padding: 30px;
    text-align: center;
    border-top: 1px solid #ddd;
}

.footer img {
    max-width: 400px;
    height: auto;
    margin-bottom: 20px;
}

.version {
    color: #999;
    font-size: 12px;
    margin-top: 10px;
}
</style>
</head>

<body>
<?php
  // ini_set('session.gc_maxlifetime', 7200);
//session_save_path("/home/users/web/b2704/glo.konamistorage/cgi-bin/tmp");
// session_start();
// will bounce the user if they've not visited an age-verify form
if(!isset($_COOKIE['legal']) || $_COOKIE['legal'] != 'yes') {
    header('location: /newsletter/md_signup/agegate.php');
    exit;
}
?>

<div class="container">
    <div class="header">
        <img src="img/konami_logo.png" alt="KONAMI" />
    </div>
    
    <div class="logo-section">
        <img src="img/MD_logo_225x110.png" alt="Yu-Gi-Oh! Master Duel" />
    </div>
    
    <div class="content">
        <div class="form-container">
            <iframe src="https://cdn.forms-content-1.sg-form.com/b0cde6b5-1866-11ef-b7eb-dea4d84223eb" style="border:none;" width="100%" height="600px"></iframe>
        </div>
        
        <div class="legal-text">
            <p><strong>By signing up, you agree with our <a href="https://legal.konami.com/kdeus/privacy/en-us/" target="_blank">Privacy Policy</a> and <a href="https://legal.konami.com/kdeus/btob/terms/tou/en/" target="_blank">TERMS OF USE</a>.</strong></p>
            <p><em>NOTE: Newsletter Signups are only for residents of the United States and associated US territories at this time. Sorry for any inconvenience and stay tuned for future updates!</em></p>
        </div>
    </div>
    
    <div class="footer">
        <img src="img/cr-digital.png" alt="Content Rating" />
        <div class="version">v 3.0.1</div>
    </div>
</div>

</body>
</html>
