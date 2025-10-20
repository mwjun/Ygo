@extends('layouts.default')

@section('title')
Store
@stop

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBljINOqMEGZWP1ft2dTZjPBba8jISfjyQ&sensor=false"></script>
<script src="script/script.js"></script>
@section('script')
window.onload = function() {
    initialize(<?php echo $location->lat; ?>,<?php echo $location->lng; ?>, 'map-canvas');
};
@stop

@section('content')
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
<div id="colfull_main">
    <div id="colfull_main_wrap" >
        <div class="store-info-wrap">
            <div class="store-info row">
                <div class="col-md-8 col-sm-12" > 
                    <div id='map-canvas'></div>
                </div>
                <div class="col-md-4 col-sm-12">
                    <form action="http://maps.google.com/maps" method="get" target="_blank">
                        <label for="saddr">
                            <h5>Enter your location</h5>
                        </label>
                        <br>
                        
                        <input type="text" class="form-control" name="saddr" placeholder="Enter Starting Point" value="<?php echo $squery; ?>" />
                        <input type="hidden" name="daddr" value="<?php echo $location->address . ' ' . $location->city . ', ' . $location->state . ' ' . $location->zip; ?>" />
                        <input type="submit" class="btn btn-info" id="search-button" value="Get directions" />
                    </form>
                    <hr>
                    <h6>Location info:</h6>
                    <div class="store-name"><?php echo $location->location; ?></div>
                    <div class="store-address"><?php echo $location->address; ?></div>
                    <div class="store-city-state"><?php echo $location->city . ', ' . $location->state . ' ' . $location->zip; ?></div>
                    <hr>
                    <?php if ($location->schedule): ?>
                        <h6>Tournament Hours:</h6>
                        <div class="store-schedule"><?php echo $location->schedule; ?></div><br>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <div class="clearer"></div>
    <div id="page-navigation">
        <p align="right"><a href="#Header1" class="link_icon">Page Top</a></p>
        <p align="right"><a href="http://www.yugioh-card.com/en/index.html" class="link_icon">Back to main</a></p>
        <p align="right"><a href="/locator" class="link_icon">Back to Locator</a></p>
    </div>
</div>
@stop
