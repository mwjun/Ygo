<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
    @include('includes.head')
</head>

<body class="no-js">

    <script>
        var el = document.getElementsByTagName("body")[0];
        el.className = "";
    </script>
    <noscript>
        <!--[if IE]>  
                <link rel="stylesheet" href="css/ie.css"> 
                <link rel="stylesheet" href="css/ie7.css"> 
            <![endif]-->
    </noscript>
    <div class="container">
        <div id="topbar">
            <div id="tbar_mid">
                <div class="Lang_Navi" id="fl_navi">English | <a href="http://www.yugioh-card.com/lat-am/">Espa&ntilde;ol</a> | <a href="http://www.yugioh-card.com/lat-am/pt/">PortuguÃªs</a> <img src="img/lang.png" width="10" height="10"></div>
            </div>
        </div>
    </div>
    <div class="container p-0">


        <div id="wrapper">
            <div class="row m-0 p-0">
                <div class="col-md-8 col-sm-3 col-12 mr-auto">
                    <img src="img/konami_logo.png" width="177" height="23" align="bottom">


                </div>
<!-- 
                <div class="col-md-4 col-sm-9 col-12">
                    <form class="input-group mb-3" name="ygo_search" method="get" action="https://www.google.com/search">
                        <input type="text" class="form-control" placeholder="Search" name="q" type value="" maxlength="255" style="color: #FFFFFF;font-size:10px; background-color:#777777; border:none;">
                        <div class="">
                            <input class="pt-1" type="image" name="submit" src="https://img.yugioh-card.com/en/images/icons/search.png" border="0" />
                        </div>
                    </form>

                </div> -->
            </div>
            <div class="d-flex justify-content-between">
                <!-- style="background-image: url(./img/responsive/navbar-left-red.png); background-repeat: no-repeat; background-position: right 10px;" -->
                <div class="">
                    <img class="navbar-left__img" src="./img/responsive/navbar-left-red.png" alt="">
                </div>
                <div class="navbar-center" style="background-image: url(./img/responsive/navbar-background.png); background-repeat: repeat-x; background-position: left 10px;">
                    <nav class="navbar navbar-expand-lg navbar-light m-0 p-0">
                        <a class="" href="#">
                            <img src="./img/responsive/navbar-brand.png" alt="">
                        </a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav mr-auto mx-auto "> <!--  float-right -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link" href="http://www.yugioh-card.com/en/products/index.html" id="navbarDropdownProducts" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <!-- <img src="./img/responsive/products_menu.png" alt=""> -->
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/products/boosters.html">Booster</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/products/special_edition.html">Special/Deluxe Edition</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/products/starter_deck.html">Starter Decks</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/products/structure_deck.html">Structure Deck</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/products/tins.html">Tin</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/products/duelist_pack.html">Duelist Pack</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/products/accessories.html">Accessories</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/products/others.html">Others</a>

                                    </div>
                                </li>
                                <li class="nav-item  dropdown">
                                    <a class="nav-link" href="http://www.yugioh-card.com/en/gameplay/index.html" id="navbarDropdownGameplay" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <!-- <img src="./img/responsive/gameplay_menu.png" alt=""> -->
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/rulebook/index.html">Rule Book</a>
                                        <a class="dropdown-item" href="http://www.konami.com/yugioh/articles/">Strategy Site</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/limited/index.html">Forbidden & Limited List</a>
                                        <a class="dropdown-item" href="http://www.db.yugioh-card.com/yugiohdb/">Card Database</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/gameplay/fasteffects_timing.html">Advanced Rules</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/gameplay/card_faq1.html">Complex Card Information</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/gameplay/demo.html">Learn to Duel Demo</a>

                                    </div>
                                </li>
                                <li class="nav-item  dropdown">
                                    <a class="nav-link" href="http://www.yugioh-card.com/en/events/index.html" id="navbarDropdownEvents" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <!-- <img src="./img/responsive/events_menu.png" alt=""> -->
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/events/organizedplay.html">Organized Play and Ranking</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/events/eventscoverage.html">Premier Events and Coverage</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/events/sneakpeek.html">Sneak Peek Events</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/league/index.html">League Events</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/events/specialevents.html">Special Tournaments</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/events/locations.html">Official Tournament Store Locator</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/about/parents.html">For Parents</a>
                                    </div>
                                </li>

                                <li class="nav-item dropdown ">
                                    <a class="nav-link " href="http://www.yugioh-card.com/en/about/index.html" id="navbarDropdownAbout" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <!-- <img src="./img/responsive/about_menu.png" alt=""> -->
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/about/newto.html">New To Yu-Gi-Oh! </a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/about/parents.html">Information for Parents</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/about/glossary.html">Glossary</a>
                                        <a class="dropdown-item" href="http://www.yugioh-card.com/en/news/index.html">Press Releases</a>
                                    </div>
                                </li>
                            </ul>

                        </div>
                    </nav>
                </div>
                <div>
                    <img class="navbar-right__img" src="./img/responsive/navbar-right-red.png" alt="">
                </div>
            </div>

            <br>



            <!-- <div id="content_colfull"> -->
            <div>
                <!-- <div id="col_header"><img src="../images/columnbar_full.png" width="930" height="25"></div>   -->
                <div>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr align="center">
                            <!-- <td><img src="https://yugiohblog.konami.com/contest/images/dragon_duel_ttl.jpg"width="900" height="282"></td> -->
                        </tr>
                    </table>
                    <div id="content">
                        @yield('content')


                    </div>
                </div>

                <div id="footer">
                    <a href="https://legal.konami.com/kdeus/privacy/en-us/">Privacy</a> | <a href="https://legal.konami.com/kdeus/yugioh/terms/tou/en/">Terms of Use</a> | <a href="https://legal.konami.com/kdeus/privacy/ca-notice-at-collection/en-us/">California Notice At Collection</a> | <a href="https://www.yugioh-card.com/en/about/code-of-conduct/">Code of Conduct</a>

                    <div class="d-flex justify-content-center mt-2">
                        <img src="img/copyright.gif">
                    </div>
                </div>
            </div>
            <script>
                /*
            (function($){   
                
                
                var nav = $("#topNav");   
                
                
                nav.find("li").each(function() {   
                    if ($(this).find("ul").length > 0) {   
                        
                        $("<span>").text(" ").appendTo($(this).children(":first"));   
                        
                        
                        $(this).mouseenter(function() {   
                            $(this).find("ul").stop(true, true).slideDown();   
                        });   
                        
                        
                        $(this).mouseleave(function() {   
                            $(this).find("ul").stop(true, true).slideUp();   
                        });   
                    }   
                });   
            })(jQuery);   

            */
            </script>

</body>

</html>