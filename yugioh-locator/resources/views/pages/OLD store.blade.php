@extends('layouts.default')

@section('title')
Store
@stop

@section('include-script')
{{ HTML::script('https://maps.googleapis.com/maps/api/js?key=AIzaSyDCrNfHx2HuxRAGFX_ZB4o2y_ZIGPhSid4&sensor=false'); }}
{{ HTML::script('script/script.js'); }}
@stop

@section('script')
window.onload = function() {
    initialize(<?php echo $location->lat; ?>,<?php echo $location->lng; ?>, 'map-canvas');
};
@stop

@section('content')
<div id="col_headertab"><img src="img/locations_ttl.png" width="930" height="35"></div>
<div id="colfull_main">
    <div id="colfull_main_wrap">
        <div class="store-info-wrap">
            <div class="store-info">
                <div class="store-location-map-wrap">
                    <div id='map-canvas'></div>
                </div>
                <div class="store-location">
                    <form action="http://maps.google.com/maps" method="get" target="_blank">
                        <label for="saddr">Enter your location</label><br>
                        <input type="text" name="saddr" placeholder="Enter Starting Point" value="<?php echo $squery; ?>" />
                        <input type="hidden" name="daddr" value="<?php echo $location->address . ' ' . $location->city . ', ' . $location->state . ' ' . $location->zip; ?>" />
                        <input type="submit" value="Get directions" />
                    </form>
                    <h5>Location info:</h5>
                    <div class="store-name"><?php echo $location->location; ?></div>
                    <div class="store-address"><?php echo $location->address; ?></div>
                    <div class="store-city-state"><?php echo $location->city . ', ' . $location->state . ' ' . $location->zip; ?></div>
                    <?php if ($location->schedule): ?>
                        <h5>Tournament Hours:</h5>
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
