<meta charset="utf-8" />
<meta name="description" content="yugioh Yu-Gi-Oh! Yu-Gi-Oh locator event" />
<meta name="author" content="bkim kdeus" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />

<link rel="shortcut icon" href="https://www.yugioh-card.com/yugioh.ico" type="image/x-icon" />
<title>@yield('title') | Yu-Gi-Oh! OTS & Event Locations</title>


<!-- scripts -->

<script src="{{ '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'}}"></script>
<script src="{{ '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js'}}"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<!-- stylesheets -->

<link href="style/style.css" rel="stylesheet">
<link href="style/ygo_v3.css" rel="stylesheet">
<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css" rel="stylesheet">



@yield('include-script')

<!-- dynamically formed script -->
<script type="text/javascript">@yield('script')</script>