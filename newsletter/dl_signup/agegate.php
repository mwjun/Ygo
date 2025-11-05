<?php
// ini_set('session.gc_maxlifetime', 7200);
//session_save_path("/home/users/web/b2704/glo.konamistorage/cgi-bin/tmp");
// session_start();
?>

<?php
if(isset($_COOKIE['legal'])) { # If the cookie has been set by the script earlier...
$url = ($_COOKIE['legal'] == 'yes') ? 'index.php' : 'redirect.php';
header ('Location: ' .$url);
}?>


<?php
if(isset($_POST['checkage'])) {
$sesh = preg_replace("/[^0-9?!]/",'',$_REQUEST['sesh']);
if ($sesh != session_id()) header('HTTP/1.0 404 Not Found');
$day = ctype_digit($_POST['day']) ? $_POST['day'] : '';
$month = ctype_digit($_POST['month']) ? $_POST['month'] : '';
$year = ctype_digit($_POST['year']) ? $_POST['year'] : '';

$birthstamp = mktime(0, 0, 0, $month, $day, $year);
$diff = time() - $birthstamp;
$age_years = floor($diff / 31556926);
if($age_years >= 16) {
// $_SESSION['legal'] = 'yes';
// 2hrs
setcookie('legal', 'yes', time()+7200, '/');

$url = 'index.php';
} else {
// $_SESSION['legal'] = 'no';
setcookie('legal', 'no', time()+7200, '/');

# Your request can't be processed at this time.
$url = 'redirect.php';
}
header ('Location: ' .$url);
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Age Verification - Yu-Gi-Oh! Duel Links</title>
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
    max-width: 600px;
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

.age-form {
    background: #f9f9f9;
    padding: 30px;
    border-radius: 8px;
    margin: 20px 0;
}

.age-form p {
    text-align: center;
    font-size: 16px;
    margin-bottom: 25px;
    color: #333;
}

.form-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.form-group select {
    padding: 10px 15px;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background: white;
    cursor: pointer;
    transition: border-color 0.3s;
    min-width: 120px;
}

.form-group select:hover {
    border-color: #b00000;
}

.form-group select:focus {
    outline: none;
    border-color: #b00000;
    box-shadow: 0 0 0 3px rgba(176, 0, 0, 0.1);
}

.submit-btn {
    background: linear-gradient(135deg, #b00000 0%, #8a0000 100%);
    color: white;
    padding: 12px 40px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 10px;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(176, 0, 0, 0.3);
}

.submit-btn:active {
    transform: translateY(0);
}

.footer {
    background: #f8f8f8;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #ddd;
}

.footer img {
    max-width: 350px;
    height: auto;
    margin-bottom: 10px;
}

.version {
    color: #999;
    font-size: 12px;
    margin-top: 10px;
}
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <a href="http://www.konami.com/"><img src="img/konami_logo.png" alt="KONAMI" /></a>
    </div>
    
    <div class="logo-section">
        <img src="img/Duel-Links-225x120.png" alt="Yu-Gi-Oh! Duel Links" />
    </div>
    
    <div class="content">
        <div class="age-form">
            <p><strong>Please enter your date of birth to enter this site.</strong></p>
            <form name="age" id="age" method="post" action="">
                <div class="form-group">
                    <select id="month" name="month">
          <option value="0" selected="selected">Month</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
                    </select>
                    <select id="day" name="day">
          <option value="0" selected="selected">Day</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
          <option value="24">24</option>
          <option value="25">25</option>
          <option value="26">26</option>
          <option value="27">27</option>
          <option value="28">28</option>
          <option value="29">29</option>
          <option value="30">30</option>
          <option value="31">31</option>
                    </select>
                    <select id="year" name="year">
          <option value="0" selected="selected">Year</option>
          <option value="2024" >2024</option>
          <option value="2023" >2023</option>
          <option value="2022" >2022</option>
          <option value="2021" >2021</option>
          <option value="2020" >2020</option>
          <option value="2019" >2019</option>
          <option value="2018" >2018</option>
          <option value="2017" >2017</option>
          <option value="2016" >2016</option>
          <option value="2015" >2015</option>
          <option value="2014" >2014</option>
          <option value="2013" >2013</option>
          <option value="2012" >2012</option>
          <option value="2011" >2011</option>
          <option value="2010" >2010</option>
          <option value="2009" >2009</option>
          <option value="2008" >2008</option>
          <option value="2007" >2007</option>
          <option value="2006" >2006</option>
          <option value="2005" >2005</option>
          <option value="2004" >2004</option>
          <option value="2003" >2003</option>
          <option value="2002" >2002</option>
          <option value="2001" >2001</option>
          <option value="2000" >2000</option>
          <option value="1999" >1999</option>
          <option value="1998" >1998</option>
          <option value="1997" >1997</option>
          <option value="1996" >1996</option>
          <option value="1995">1995</option>
          <option value="1994">1994</option>
          <option value="1993">1993</option>
          <option value="1992">1992</option>
          <option value="1991">1991</option>
          <option value="1990">1990</option>
          <option value="1989">1989</option>
          <option value="1988">1988</option>
          <option value="1987">1987</option>
          <option value="1986">1986</option>
          <option value="1985">1985</option>
          <option value="1984">1984</option>
          <option value="1983">1983</option>
          <option value="1982">1982</option>
          <option value="1981">1981</option>
          <option value="1980">1980</option>
          <option value="1979">1979</option>
          <option value="1978">1978</option>
          <option value="1977">1977</option>
          <option value="1976">1976</option>
          <option value="1975">1975</option>
          <option value="1974">1974</option>
          <option value="1973">1973</option>
          <option value="1972">1972</option>
          <option value="1971">1971</option>
          <option value="1970">1970</option>
          <option value="1969">1969</option>
          <option value="1968">1968</option>
          <option value="1967">1967</option>
          <option value="1966">1966</option>
          <option value="1965">1965</option>
          <option value="1964">1964</option>
          <option value="1963">1963</option>
          <option value="1962">1962</option>
          <option value="1961">1961</option>
          <option value="1960">1960</option>
          <option value="1959">1959</option>
          <option value="1958">1958</option>
          <option value="1957">1957</option>
          <option value="1956">1956</option>
          <option value="1955">1955</option>
          <option value="1954">1954</option>
          <option value="1953">1953</option>
          <option value="1952">1952</option>
          <option value="1951">1951</option>
          <option value="1950">1950</option>
          <option value="1949">1949</option>
          <option value="1948">1948</option>
          <option value="1947" >1947</option>
          <option value="1946" >1946</option>
          <option value="1945" >1945</option>
          <option value="1944" >1944</option>
          <option value="1943" >1943</option>
          <option value="1942" >1942</option>
          <option value="1941" >1941</option>
          <option value="1940" >1940</option>
          <option value="1939" >1939</option>
          <option value="1938" >1938</option>
          <option value="1937" >1937</option>
          <option value="1936" >1936</option>
          <option value="1935" >1935</option>
          <option value="1934" >1934</option>
          <option value="1933" >1933</option>
          <option value="1932" >1932</option>
          <option value="1931" >1931</option>
          <option value="1930" >1930</option>
          <option value="1929" >1929</option>
          <option value="1928" >1928</option>
          <option value="1927" >1927</option>
          <option value="1926" >1926</option>
          <option value="1925" >1925</option>
                    </select>
                    <input type="hidden" name="sesh" value="<?php echo session_id() ?>" />
                    <button type="submit" name="checkage" id="checkage" class="submit-btn">Enter</button>
                </div>
            </form>
        </div>
    </div>
    
    <div class="footer">
        <img src="img/cr-digital.png" alt="Content Rating" />
        <div class="version">v 3.0.1</div>
    </div>
</div>
</body>
</html>


