@extends('layouts.default')

@section('title')
List
@stop

@section('include-script')
{{ HTML::script('script/list-script.js'); }}
@stop

@section('script')
@stop

@section('content')
<div id="col_headertab"><img src="img/locations_top.png" width="930" height="35"></div>
<div id="colfull_main">
    <div id="colfull_main_wrap">
        <div id="list-wrap">
            <div id="list-search-type">
                <h2>Search Type</h2>
                <label><input type="radio" class="search-type" name="search-type" value="ots" checked="checked">Official Tournament Store</label><br>
                <label><input type="radio" class="search-type" name="search-type" value="rts">Regional Qualifier Location</label>
            </div>
            <div id="list-region-type">
                <h2>Region</h2>
                <label><input type="radio" id="region-type" name="region-type" value="na" checked="checked">North America</label>
            </div>
            <div id="list-country-wrap">
                <h2>Country</h2>
                <div id="list-country">
                    @include('pages.listcountry')
                </div>
            </div>
            <div id="list-state-wrap">
                <h2>State</h2>
                <select id="state">
                    @include('pages.liststate')
                </select>
            </div>
        </div>
        <div id="list-table-wrap">
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
