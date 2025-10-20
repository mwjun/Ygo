$(document).ready(function() {
    $('#list-search-type').on('change', '.search-type', function() { 
        $('#list-table-wrap').html('');
        setRadiobuttons('search-type', this);
        getCountriesFromSearchType($(this).val());
        getStatesFromCountry($('input[name="country"]:checked').val());
    });

    $('#list-country').on('change', '.country', function() {
        $('#list-table-wrap').html('');
        setRadiobuttons('country', this);
        getStatesFromCountry($(this).val());
    });

    $('#list-state-wrap').on('change', '#state', function() {
        getLocationsTable($(this).val());
    });
});

function getCountriesFromSearchType(search_type) {
    var listUrl = 'countrylist?stype=' + search_type;
    
    $.ajax({
        url: listUrl,
        type: 'get',
        success: function(output) {
            $('#list-country').html(output);
        },
        error: function(statusText, errorThrown) {
        }
    });
}

function getStatesFromCountry(search_country) {
    var search_type =  $('input[name="search-type"]:checked').val();
    var stateUrl = 'statelist?stype=' + search_type + '&scountry=' + search_country;

    $.ajax({
        url: stateUrl,
        type: 'get',
        success: function(output) {
            $('#state').html(output);
        },
        error: function(statusText, errorThrown) {
        }
    });
}

function getLocationsTable(search_state) {
    var search_type =  $('input[name="search-type"]:checked').val();
    var country = $('input[name="country"]:checked').val();
    var locUrl = 'locationlist?stype=' + search_type + '&country=' + country + '&state=' + search_state;
    
    $.ajax({
        url: locUrl,
        type: 'get',
        success: function(output) {
            $('#list-table-wrap').html(output);
        },
        error: function(statusText, errorThrown) {
        }
    });
}

function setRadiobuttons(class_name, this_active_btn) {
    $('.' + class_name).removeAttr("checked");
    $(this_active_btn).attr("checked", "checked");
    $(this_active_btn).prop("checked", true);
}
