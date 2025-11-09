@extends('layouts.default')

@section('title')
Search
@stop

@section('include-script')
{{ HTML::script('https://maps.googleapis.com/maps/api/js?key=AIzaSyDCrNfHx2HuxRAGFX_ZB4o2y_ZIGPhSid4&sensor=false'); }}
{{ HTML::script('script/script.js'); }}
@stop

@section('script')
@stop

@section('content')
<script>
  function getURLParameter(name){
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
  }
 
  $(document).ready(function(){
    //var output = getURLParameter('http://www.w3schools.com/submit.htm?email=someone@example.com');
    var output = getURLParameter('s');
    // console.log('output: '+output);

    switch(output){
      case "regional":

        $('#tourney-select').val("rts");
        $('#rts-options').css({'display':'block'});
        showFilter('rts');
        //$('#tourney-select option:contains("rts")').attr('selected', true);
        break;
      case "sneakpeek":

        $('#tourney-select').val("spe");
        showFilter('spe');
        // window.location.href = "http://www.yugioh-card.com/en/events/sneakpeek/sneakpeek_current-locations.html";
        break;
      default:

        $('#tourney-select').val("ots");
        showFilter('ots');

    }

  });

</script>


<div id="col_headertab"><img src="img/locations_ttl.png" width="930" height="35"></div>
<div id="colfull_main">
    <div id="colfull_main_wrap">
        <div id="search-wrap">
            <div id="colfull_main_info">
                <text>Find an Official Konami Tournament Store in your area that holds Yu-Gi-Oh! TRADING CARD GAME Tournaments. Please contact your local Official Tournament Store directly for more information about their Tournaments.</text>
            </div>
            <div id="search"><!-- search -->
                <div id='search-area'>
                    <h4>Search Store/Event</h4>
                    <select id="tourney-select" onchange="showFilter(this)">
                        <option value="0" disabled="disabled">-------------------------------------Store-------------------------------------</option>
                        <option value="ots">Official Tournament Store</option>
                        <option value="0" disabled="disabled">-------------------------------------Event-------------------------------------</option>
                        <option value="rts">Regional Qualifier Location</option>
                        <option value="spe">Sneak Peek Event</option>
                    </select>
                </div>
                <div class="clearer"></div>
                <div id="search-filter-options">
                    <h4>City and State or Zip Code:</h4>
                    <input name="search-field" type="text" id="search-field" onkeypress="checkIfReturnKey(event);" placeholder="Enter City and State or ZIP Code"/><br><br>
                    <label for="radius-field">Distance:</label>
                    <select id="radius-field" name="radius-field">
					  <option value="10.0">10 </option>
                        <option value="25.0">25 </option>
                        <option value="50.0">50 </option>
                        <option value="75.0">75 </option>
                        <option value="100.0">100 </option>
                        <option value="150.0">150 </option>
                        <option value="200.0">200 </option>
                        <option value="250.0">250 </option>
                        <option value="300.0">300 </option>
                        <option value="400.0">400 </option>
                        <option value="500.0">500 </option>
                        <option value="600.0">600 </option>
                    </select><text>Miles</text>
                    <div class="clearer"></div>
                    <div id="ots-options" class="tourney-options">
                        <h4>Optional search filter</h4>
                        <label><input type="checkbox" id="duel-term-box">Duel Terminal</label>
                    </div>
                    <div id="rts-options" style="display: none;" class="tourney-options">
                        <h4>Optional search filter</h4>
                        
                    </div>
                    

                    <div id="spe-options" style="display: none;" class="tourney-options">

                        <h4>Optional search filter</h4>
                    
                    </div>
                    <div style="display: none;" class="tourney-options-optional" >
                        <label><input type="checkbox" id="past-events-box" />Include All Events, Past and Present</label><br>
                        <text> -- OR -- </text><br>
                        <label>Enter upcoming date range:</label><br>
                        <input type="text" class="date-pick" id="date-start"/> <text> - </text>
                        <input type="text" class="date-pick" id="date-end"/><br>
                    </div>

                    <div class="clearer"></div>
                    <div id="search-btn-div" style="margin-top: 2em;">
                        <input type="hidden" id="page-num" value="0" />
                        <button id="search-button" type="button" onclick="searchLocations()">Search</button>
                    </div>
                </div>
            </div><!-- end search -->
        </div><!-- end search-wrap -->
        <div id="map-wrap">
            <div id="map-canvas"></div>
        </div>
        <div class="clearer"></div>
        <hr>
        <div id="search-results-wrap">
            <div id="search-results-head" style="display: none;">
                <div style=" width: 8em; margin-left: 1em; float: left;">STORE NAME</div>
                <div style="margin-left: 21em; width: 6em; float: left;">DISTANCE</div>
                <div id="head-hours"style="margin-left: 9.8em; float: left;">TOURNAMENT HOURS</div>
                <div style="clear: both;"></div>
                <hr>
            </div>
            <div id="search-results"></div>
        </div>
    </div><!-- end "colfull_main_wrap" -->
    <div id="search-next-page"></div>
    <div id="search-current-page" style="display: none;">
        <div>Viewing Results</div><div id="search-current"></div><div> of </div><div id="search-total"></div>
    </div>
    <div class="clearer"></div>
    <div id="page-navigation">
        <p align="left">While we make every effort to ensure the accuracy of this locator, please be aware that locations and/or tournament information may change without notice. Please contact your local Official Tournament Store directly for more information about specific locations and times.</p>
        <p align="left"><a href="http://www.yugioh-card.com/en/events/KonamiOTS.pdf">Click here for a downloadable list of US &amp; Canada OTS locations</a></p>
        <p align="right"><a href="#Header1" class="link_icon">Page Top</a></p>
        <p align="right"><a href="http://www.yugioh-card.com/en/index.html" class="link_icon">Back to main</a></p>
    </div>
</div>
@stop
