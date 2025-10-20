<?php 

function reqVersion() {
	$version = "";
	if (isset($_REQUEST['v'])) {
		$version = $_REQUEST['v'];
	} else {
		$version = 1.0;
	}
	return $version;
} 

function getVersion() {
        $version = "";
        if (isset($_GET['v'])) {
                $version = $_GET['v'];
        } else {
                $version = 1.0;
        }
        return $version;
}

function reqLang() {
        $lang= "";
        if (isset($_REQUEST['l'])) {
                $lang = $_REQUEST['l'];
        } else {
                $lang = 'us';
        }
        return $lang;
}

function getLang() {
        $lang = "";
        if (isset($_GET['l'])) {
                $lang = $_GET['l'];
        } else {
                $lang = 'us';
        }
        return $lang;
}

function reqTest() {
        $test= "";
        if (isset($_REQUEST['t'])) {
                $test = $_REQUEST['t'];
        } else {
                $test = 'rulings';
        }
        return $test;
}

function getTest() {
        $test = "";
        if (isset($_GET['t'])) {
                $test = $_GET['t'];
        } else {
                $test = 'rulings';
        }
        return $test;
}

?>
