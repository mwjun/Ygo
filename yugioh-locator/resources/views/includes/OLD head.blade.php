<meta charset="utf-8" />
<meta name="description" content="yugioh Yu-Gi-Oh! Yu-Gi-Oh locator event" />
<meta name="author" content="bkim kdeus" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />

<link rel="shortcut icon" href="https://www.yugioh-card.com/yugioh.ico" type="image/x-icon" />
<title>@yield('title') | Yu-Gi-Oh! OTS & Event Locations</title>

<!-- stylesheets -->
{{ HTML::style('style/style.css'); }}
{{ HTML::style('style/ygo_v3.css'); }}
{{ HTML::style('//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css'); }}

<!-- scripts -->
{{ HTML::script('//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'); }}
{{ HTML::script('//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js'); }}

@yield('include-script')

<!-- dynamically formed script -->
<script type="text/javascript">@yield('script')</script>
