window.addEventListener('load', initialize)

// google.maps.event.addDomListener(window, "load", initialize);

// initial view of the map when user first enters location search window 
// default to LOS ANGELES location when no search has been performed yet
function initialize(lat, lng, elementName) {


    markers = [];

    var flag = false;
    // initial view of the map when no search has been done yet (LOS ANGELES)
    if (!(lat && lng)) {
        lat = 33.9023790;
        lng = -118.3801850;
        zoom = 4;
    }
    else {
        flag = true;
        zoom = 11;
    }

    // initial map-canvas is on the search page previous to a search being made
    if (!elementName) {
        elementName = 'map-canvas';
        flag = false;
    }

    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: zoom
    };

    map = new google.maps.Map(document.getElementById(elementName), mapOptions);     // map object used everywhere
    infoWindow = new google.maps.InfoWindow();                    // gmaps object - tooltip within the map display
    searchResults = document.getElementById("search-results");    // DOM object where the results will be displayed

    // initlizing store page map, which should have a marker for the searched spot
    if (flag) setCurrentPosMarker(new google.maps.LatLng(lat, lng));

    // REVERSE GEOCODING 
    getLocation();



    // AUTOCOMPLETE. But it uses too many Google Maps API requests
    /*
        var input = document.getElementById('search-field');
        if (input) {
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);
            // Set initial restrict to the greater list of countries.
            autocomplete.setComponentRestrictions({'country': ['us', 'ca', 'au', 'br']});
            // Set the data fields to return when the user selects a place.
            autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']); 
    
            autocomplete.addListener('place_changed', function() {
              infoWindow.close();
              //marker.setVisible(false);
              var place = autocomplete.getPlace();
              if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                //window.alert("No details available for input: '" + place.name + "'");
                return;
              }
    
              // If the place has a geometry, then present it on a map.
              if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
              } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  // Why 17? Because it looks good.
              }
              //marker.setPosition(place.geometry.location);
              //marker.setVisible(true);
              searchLocations();
              var address = '';
              if (place.address_components) {
                address = [
                  (place.address_components[0] && place.address_components[0].short_name || ''),
                  (place.address_components[1] && place.address_components[1].short_name || ''),
                      (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
              }
            });
        }
    
        */
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    //x.innerHTML = "Latitude: " + position.coords.latitude +  "<br>Longitude: " + position.coords.longitude;
    var geocoder = new google.maps.Geocoder;
    var latlng = { lat: position.coords.latitude, lng: position.coords.longitude };

    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                $('#search-field').val(results[0].formatted_address);
                searchLocations();
            }
        }
    })
}

// search for the geocode given a physical address
// looks at the search field triggered by button click event
function searchLocations(reset) {

    if (!reset) {
        $('#page-num').val(0);
    }

    var address = $('#search-field').val();
    var geocoder = new google.maps.Geocoder();

    if (address) {
        if (address.length >= 3) {
            geocoder.geocode({ address: address }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    // looking for 
                    searchLocationsNear(results[0].geometry.location);

                } else {
                    $('#search-results').html(address + ' did not yield any results. Please increase the radius or try another location');
                }
            });
        } else {
            $('#search-results').html('Please enter more than 3 characters');
            $('#search-next-page, #search-current-page').hide();
        }
    } else {
        $('#search-results').html('Empty search: must enter a search value');
        $('#search-next-page, #search-current-page').hide();
    }
}

// searches stores stored in locator DB within a radius and a geocode location
function searchLocationsNear(center) {
    clearLocations();
    setCurrentPosMarker(center);

    var radius = $('#radius-field').val();
    var tourney_type = $('#tourney-select').val();
    var page = $('#page-num').val();

    //var duel_term = document.getElementById('duel-term-box').checked;
    var rem_duel = document.getElementById('remote-duel-box').checked;
    var past_events = document.getElementById('past-events-box').checked;

    if (tourney_type == 'ots')
        options = rem_duel;
    else if (tourney_type == 'rts')
        options = past_events;
    else if (tourney_type == 'spe')
        options = '';

    var start_date = $('#date-start').val();
    var end_date = $('#date-end').val();
    var searchUrl = 'result?lat=' + center.lat() + '&lng=' + center.lng() + '&radius=' + radius + '&type=' + tourney_type +
        '&options=' + options + '&sdate=' + start_date + '&edate=' + end_date + '&page=' + page;
    console.log(searchUrl)
    $.ajax(
        {
            url: searchUrl,
            type: 'get',
            success: function (output) {
                processStoreLocations(output['result'], tourney_type);
                processResultCount(output['count'], page);
            },
            error: function (statusText, errorThrown) {
                console.log(statusText)
            }
        }
    );
}

function searchLocationsByName(name) {
    clearLocations();

    var tourney_type = $('#tourney-select').val();
    var page = $('#page-num').val();

    var duel_term = document.getElementById('duel-term-box').checked;
    var rem_duel = document.getElementById('remote-duel-box').checked;
    var past_events = document.getElementById('past-events-box').checked;

    if (tourney_type == 'ots')
        options = rem_duel;
    else if (tourney_type == 'rts')
        options = past_events;
    else if (tourney_type == 'spe')
        options = '';

    var start_date = $('#date-start').val();
    var end_date = $('#date-end').val();

    var searchUrl = 'resultByName?name=' + name + '&type=' + tourney_type +
        '&options=' + options + '&sdate=' + start_date + '&edate=' + end_date + '&page=' + page;

    $.ajax(
        {
            url: searchUrl,
            type: 'get',
            success: function (output) {
                processStoreLocations(output['result'], tourney_type);
                processResultCount(output['count'], page);
            },
            error: function (statusText, errorThrown) {
            }
        }
    );
}

function processStoreLocations(output, stype) {

    if (stype == 'spe') {
        $('#head-hours').html('SNEAK PEEK HOURS');
    } else {
        $('#head-hours').html('TOURNAMENT HOURS');
    }
    var totalStores = output.length;
    var bounds = new google.maps.LatLngBounds();
    var previous;   // hold previous results
    var count = 0;

    // No results found
    if (totalStores <= 0) {
        $('#search-results-head').hide();
        searchResults.innerHTML = 'No results - try expanding your radius';
        $('#search-current-page, #search-next-page').hide();
        return;
    }
    else {
        // display the page counter
        $('#search-current-page, #search-next-page').show();

        // process store into column indexed arrays.
        for (i = 0; i < totalStores; i++) {

            var locationElement = new Array();

            locationElement['id'] = output[i].id;
            locationElement['location'] = output[i].location;
            locationElement['host'] = output[i].host;
            locationElement['address'] = output[i].address;
            locationElement['address2'] = output[i].address2;
            locationElement['city'] = output[i].city;
            locationElement['state'] = output[i].state;
            locationElement['phone'] = output[i].phone;
            locationElement['email'] = output[i].email;
            locationElement['zip'] = output[i].zip;
            locationElement['distance'] = parseFloat(output[i].distance);
            locationElement['cap'] = output[i].cap;
            locationElement['latlng'] = new google.maps.LatLng(parseFloat(output[i].lat), parseFloat(output[i].lng));

            var duel_term = (output[i].duel_terminal != 1) ? 0 : 1;
            locationElement['duel_terminal'] = output[i].duel_terminal;
            locationElement['past_events'] = (output[i].past_events) ? 1 : 0;
            locationElement['time'] = output[i].time;
            locationElement['date'] = output[i].date;
            locationElement['stype'] = stype;
            locationElement['schedule'] = output[i].schedule;
            locationElement['completed'] = output[i].completed;

            var drag_duel = (output[i].dragon_duel != 1) ? 0 : 1;
            locationElement['dragon_duel'] = output[i].dragon_duel;
            locationElement['completed_results'] = output[i].completed_results;

            locationElement['event_name'] = output[i].event_name;

            var featured = (output[i].featured != 1) ? 0 : 1;
            locationElement['featured'] = output[i].featured;

            locationElement['featured_url'] = output[i].featured_url;

            locationElement['remote_duel'] = output[i].remote_duel;
            if ((previous != locationElement['id'])) {
                count++;
                createStoreMarker(locationElement, count);
            }

            locationElement['discord_invite'] = output[i].discord_invite;



            addToSearchList(locationElement, count);
            bounds.extend(locationElement['latlng']);

            previous = locationElement['id'];

        }

        map.fitBounds(bounds);
    }
}

// displays the page number and total results count
function processResultCount(result_count, page) {

    $('#search-results-head').show();   // show the header "STORE NAME - DISTANCE  - TOURNAMENT HOURS"
    $('#search-total').html(result_count);      // inputs the total location count

    if (parseInt(page) * 20 + 20 < result_count) {
        $('#search-current').html((parseInt(page) * 20 + 1) + '-' + (parseInt(page) * 20 + 20));
        $('#page-num').val(parseInt(page) + 1);
        $('#search-next-page').html('<a class="link_icon" href="javascript:void(0);" onclick="setNextPage(' + page + ');">Next Page</a>');
    } else {
        $('#search-current').html(((parseInt(page) * 20) + 1) + ' - ' + (result_count));
        $('#search-next-page').html('');
    }
}


// add a search result to the list of results
function addToSearchList(locationElement, index) {
    var data_type = $('#data-type').val();
    var store_wrap = document.createElement("div");
    var store_element = document.createElement("div");
    var clear_element = document.createElement("div");
    var break_element = document.createElement("br");
    var distance_element = document.createElement("div");
    var schedule_element = document.createElement("div");
    var schedule_inner = schedule_element.innerHTML;
    var icon_element_duel_terminal = document.createElement("div");

    store_wrap.className = 'row store-wrap store-' + locationElement['id'];
    var address2 = (locationElement['address2']) ? ' - ' + locationElement['address2'] : '';

    // store list results
    store_element.className = 'store-item col-sm-5 col-8';
    store_element.innerHTML = createStoreSearchListElement(locationElement, index);

    // schedule div
    schedule_element.setAttribute("id", 'location-schedule-' + locationElement['id']);
    schedule_element.setAttribute("class", "location-schedule col-sm-4 col-12");

    // ots
    if (locationElement['schedule'])
        schedule_element.innerHTML = locationElement['schedule'];



    // spe
    if (locationElement['stype'] == 'spe') {
        var message = '';
        if (locationElement['stype'] == 'spe' && locationElement['event_name']) message = '<span style="color:#4BCBBE">' + locationElement['event_name'] + '</span>';
        else message = '';

        schedule_element.innerHTML = '<b>' + message + '</b> <br>'
        if (locationElement['date'] && locationElement['time']) {
            schedule_element.innerHTML += locationElement['date'] + ' @' + tConvert(locationElement['time'])
        } else {

            schedule_element.innerHTML += "Please contact store for schedule";
        }
    } else {
        // rts
        if (locationElement['date'] && locationElement['time']) {

            var message = '';
            if (locationElement['stype'] == 'spe' && locationElement['event_name']) message = '<span style="color:#4BCBBE">' + locationElement['event_name'] + '</span>';
            else message = 'Tournament Date & Time:';



            var dd = ((locationElement['dragon_duel'] == 1) ? 'Dragon Duel: Yes' : '')
            var cr = ((locationElement['completed_results'] == 1) ? '<a href="https://www.yugioh-card.com/en/events/wcq_invite_list.html">Results for this event have been recorded</a>' : '')

            // adding blue style where results were recorded
            if (locationElement['completed_results'] == 1) {
                store_wrap.className += ' blue';
            }

            if (locationElement['completed'])
                schedule_element.innerHTML = '<b>' + message + '</b> <br>' + '<a href="#">' + locationElement['date'] + ' @' + tConvert(locationElement['time']) + '</a><br>' + dd + '<br>' + cr;
            else
                schedule_element.innerHTML = '<b>' + message + '</b> <br>' + locationElement['date'] + ' @' + tConvert(locationElement['time']) + '<br>' + dd + '<br>' + cr;
        }
    }

    // icons div
    icon_element_duel_terminal.className = 'icon-dt-store-item';
    icon_element_duel_terminal.innerHTML = (locationElement['duel_terminal'] != null) ? '<img title="Duel Terminal Location" src="./img/duelterminal.jpg">' : '';

    // distance div
    distance_element.className = 'distance-store-item col-sm-3 col-4';
    distance_element.innerHTML = "(" + locationElement['distance'].toFixed(2) + " mi" + ")";


    clear_element.className = 'clearer';

    store_wrap.appendChild(store_element);
    store_wrap.appendChild(clear_element);
    store_wrap.appendChild(distance_element);
    distance_element.appendChild(break_element);

    distance_element.appendChild(icon_element_duel_terminal);
    store_wrap.appendChild(schedule_element);

    // additional div
    // for example featured store
    if (locationElement['featured'] == 1) {
        var featured_element = document.createElement("div");
        featured_element.className = "featured-element";
        if (locationElement['featured_url'] != null) {
            featured_element.innerHTML = 
            '<a href="' + locationElement['featured_url'] + '" target="_blank">' +
                '<img width="150px" src="img/FOTS_icon.png"/>'+               
            '</a>'+
            '<span>Click the icon to read more about this Featured OTS.</span>'
            
        } else {
            featured_element.innerHTML = '<a href="https://www.yugioh-card.com/en/events/featured_ots/archive_featuredOTS.html" target="_blank"><img width="150px" src="img/FOTS_icon.png"/></a>';
        }
        store_wrap.appendChild(featured_element);
    }

    

    store_wrap.appendChild(clear_element);
    searchResults.appendChild(store_wrap);
}

function createStoreSearchListElement(locationElement, index) {
    var featured = (locationElement['featured'] == 1) ? '<img width="200px" src="img/FOTS_banner.png"/>' : '';
    var remote_duel_element = (locationElement['remote_duel'] == 1) ? '<p><img src="img/REMOTE_DUEL_LOGO.png" alt="">This location holds Remote Duels</p>' : '';
    var discord = locationElement['discord_invite'] ? '<p>Discord Invite: ' + '<a href="'+locationElement['discord_invite']+'" target="_blank">'+locationElement['discord_invite']+'</a>'   : ''
    return '<img src="img/markers/number_' + index + '.png' + '"/>' + 
        featured + '<br>' + 
        '<a href="javascript:prepareStoreClick(' + locationElement['id'] + ',\'' + locationElement['stype'] + '\');">' + 
            locationElement['location'] + 
        '</a>' + 
        ((locationElement['host']) ? '<br>Hosted by: ' + locationElement['host'] : '') + '<br/>' + 
        locationElement['address'] + ((locationElement['address2']) ? ' - ' + locationElement['address2'] : '') + '<br/>' +
        locationElement['city'] + ', ' + locationElement['state'] + ' ' + locationElement['zip'] + '<br/>' + 
        ((locationElement['phone']) ? locationElement['phone'] : '') +
        ((locationElement['email'] && (locationElement['date'] && locationElement['time'])) ? ('<br/><a href="mailto:' + locationElement['email'] + '">' + locationElement['email'] + '</a>') : '') +
        '</a><br/>' + ((locationElement['cap']) ? 'Max Capacity: ' + locationElement['cap'] : '') + 
        '<br>' + remote_duel_element + 
        discord;
}

// sets a marker for the most current position
function setCurrentPosMarker(current) {

    var pinImage = new google.maps.MarkerImage('img/markers/direction_down.png',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

    var marker = new google.maps.Marker({
        map: map,
        icon: 'img/markers/direction_down.png',
        position: current
    });

    markers.push(marker);
}

// creates a marker object using google api to be placed on google maps
function createStoreMarker(locationElement, index) {
    var html = '<b>' + locationElement['location'] + '</b> <br/>' + locationElement['address'] + '<br/>' + locationElement['city'] + ', ' + locationElement['state'] + ' ' + locationElement['zip'];
    var marker = new google.maps.Marker({
        map: map,
        icon: 'img/markers/number_' + index + '.png',
        position: locationElement['latlng']
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
        map.setCenter(marker.getPosition());
        highlightStoreDiv(locationElement['id']);
    });
    markers.push(marker);
}

// new search - clear locations from previous search
function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
    searchResults.innerHTML = "";
}

// 
function setNextPage(page) {
    $('#page-num').val(parseInt(page) + 1);
    $('#search-next-page').html('<a href="javascript:void(0);" onclick="setNextPage();">Next</a>');
    searchLocations(true);
}

// highlights the currently clicked div when marker on map is clicked
function highlightStoreDiv(id) {
    $('.store-wrap').removeClass('gray');
    $('.store-' + id).addClass('gray');
}

function prepareStoreClick(sid, stype) {

    var squery = $('#search-field').val();
    window.location.href = "store?id=" + sid + "&stype=" + stype + "&squery=" + squery;
}

// NOP
function doNothing() { }

/*********************************************************************************************************
 * ***************** Application (non-map) functions ****************************************************/

// display the appropriate search filter options given tournament type
// @sel - select tourney options
function showFilter(sel) {
    $('.tourney-options').hide();

    $('.tourney-options-optional').hide();
    if (sel.value == '1spe') {
        $('#tourney-select').val('ots');
        window.open('https://www.yugioh-card.com/en/events/sneakpeek/sneakpeek_current-locations.html');
    }
    else if (sel == 'rts') {

        // show optional filter

        $('.tourney-options-optional').show();


    } else if (sel == 'ots') {
        $('#ots-options').show();
    }
}

// Trigger button click event when enter/return key is pressed within the search-field text box
function checkIfReturnKey(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        $('#search-button').click();
    }
}

// converts 24 hour time to 12 hour AM/PM format w/o seconds
function tConvert(time) {
    var ampm;
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        ampm = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }

    var hold = time.join('');
    var hold_array = hold.split(":");
    if (hold_array.length > 1) {
        hold = hold_array[0] + ":" + hold_array[1] + ampm;
    }

    return hold;
}


/*********************************************************************************************************
 * * ***************** Application (non-map) functions ***************************************************/
// ON READY FUNCTIONS
$(document).ready(function () {


    // disables date range picker when include all past events box is checked
    $('#past-events-box').on('change', function () {
        if ($(this).is(':checked')) {
            $(".date-pick").prop('disabled', true);
            $(".date-pick").val('');
        }
        else {
            $(".date-pick").prop('disabled', false);
        }
    });

    // formats the date in the date picker
    $('.date-pick').each(function () {
        $(this).datepicker({
            dateFormat: 'yy-mm-dd'
        });
    });

    $('#date-start, #date-end').on('change', function () {
        $('#past-events-box').attr('disabled', true);
        if (!$('#date-start').val() && !$('#date-end').val()) {
            $('#past-events-box').removeAttr('disabled');
        }
    });
});
