@extends('layouts.default')

@section('title')
Search
@stop

@section('include-script')


@stop
@push('head')

@endpush

@section('script')
@stop

@section('content')
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBljINOqMEGZWP1ft2dTZjPBba8jISfjyQ&sensor=false"></script>
<script src="script/script.js"></script>

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



<div id="col_headertab">
    <div class="d-flex justify-content-between">
        <div class=" p-0">
            <img src="./img/responsive/left-title-header.png" alt="">
        </div>
        <div class="p-0 mr-auto title-center ">

            <img class="pt-2" src="./img/responsive/ots.png" alt="">
        </div>
        <div class="p-0">
            <img src="./img/responsive/right-title-header.png" alt="">
        </div>
    </div>
</div>
<div id="colfull_main" >
    <div id="colfull_main_wrap" class="row">
        <div id="" class="col-md-6 col-sm-12">
            <div id="colfull_main_info">
                <text>Find an Official Konami Tournament Store in your area that holds Yu-Gi-Oh! TRADING CARD GAME Tournaments. Please contact your local Official Tournament Store directly for more information about their Tournaments.</text>
            </div>
            <div id="search"><!-- search -->
                <div id='search-area'>
                    <label for="tourney-select">
                        <h5>Search Store/Event</h5>
                    </label>
                    
                    <select  class="form-control" id="tourney-select" name="tourney-select" onchange="showFilter(this.value)">
                        <option value="0" disabled="disabled">-------------------------------------Store-------------------------------------</option>
                        <option value="ots">Official Tournament Store</option>
                        <option value="0" disabled="disabled">-------------------------------------Event-------------------------------------</option>
                        <option value="rts">Regional Qualifier Location</option>
                        <option value="spe">Sneak Peek Event</option>
                    </select>
                </div>
                
                <!-- <div class="clearer"></div> -->
                <div id="search-filter-options" class="row">
                    <div class="col-md-7">
                        <label for="search-field">
                            <h5>City and State or Zip Code:</h5>
                        </label>
                        <input  class="form-control" name="search-field" type="text" id="search-field" onkeypress="checkIfReturnKey(event);" placeholder="Enter City and State or ZIP Code"/>
                    </div>    
                    <div class="col-md-5 ">
                        <label for="radius-field">
                            <h5>Distance:</h5>
                        </label>
                        <div class="d-flex justify-content-between input-group">
                            
                            <select class="form-control" id="radius-field" name="radius-field">
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
                            </select>
                            <div class="input-group-append">
                                <span class="input-group-text">Miles</span>
                            </div>
                                                        
                        </div>
                    </div>
</div>
<div  class="row">              
    
                    <div id="ots-options" class="tourney-options col-md-12">
                        <hr>
                        <h5>Optional search filter:</h4> 
                        <label><input type="checkbox" id="remote-duel-box">Remote Duel</label>
                    </div>
                    <div id="rts-options" style="display: none;" class="tourney-options col-md-12">
                        <hr>
                        <label for="">  
                            <h5>Optional search filter:</h5>
                        </label>
                    </div>                  

                    <div id="spe-options" style="display: none;" class="tourney-options col-md-12">
                        <hr>
                        <h5>Optional search filter:</h4>                    
                    </div>
                    <div style="display: none;" class="tourney-options-optional col-md-12" >
               

                        <label for="radius-field">                            
                            <h6>Include All Events, Past and Present</h6>
                        </label>
                        <input name="past-events-box" type="checkbox" id="past-events-box" />

                        <text> -- OR -- </text><br>
                        <label>Enter upcoming date range:</label><br>
                        <div class="datepickers d-flex justify-content-between ">
                            <input type="text" class="date-pick form-control" id="date-start"/> <text>    -    </text>
                            <input type="text" class="date-pick form-control" id="date-end"/><br>
                        </div>
                    </div>

                    <div class="clearer"></div>
                    
                </div>
                <div id="search-btn-div" style="margin-top: 2em;">
                        <input type="hidden" id="page-num" value="0" />
                        <button class="btn btn-info mb-3" id="search-button" type="button" onclick="searchLocations()">Search</button>
                </div>
            </div><!-- end search -->
        </div><!-- end search-wrap -->
        <div id="map-wrap" class="col-md-6">
            <div id="map-canvas"></div>
        </div>
        <div class="clearer"></div>
        <hr>
        <div id="search-results-wrap" class="col-md-12">
            <div id="search-results-head" class="row" >
                <div class="col-sm-5 col-8">STORE NAME</div>
                <div class="col-sm-3 col-4">DISTANCE</div>
                <div class="col-sm-4 col-12" id="head-hours">TOURNAMENT HOURS</div>
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
        <p align="left"><a href="https://yugiohblog.konami.com/otslist/KonamiOTS.pdf">Click here for a downloadable list of US &amp; Canada OTS locations</a></p>
        <p align="right"><a href="#Header1" class="link_icon">Page Top</a></p>
        <p align="right"><a href="http://www.yugioh-card.com/en/index.html" class="link_icon">Back to main</a></p>
    </div>
</div>
@stop
