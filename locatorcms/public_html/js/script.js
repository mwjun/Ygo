$(document).ajaxStart(function () {
		$('#ajaxBusy').show();
	}).ajaxStop(function () {
		$('#ajaxBusy').hide();

		$(".main-list").tablesorter({headers: { 1: {sorter: false} }}); 
});	

var map ;
var map_edit ;

var markers_edit;

function initAutocomplete() {

	// map for add form
	initMap();
	// map for edit form
	initMapEdit();

		options = {
	   center: {lat: 34.044844, lng: -118.458589},
	   zoom: 13,
	   mapTypeId: google.maps.MapTypeId.ROADMAP,
	   mapTypeControl: false
	}
}

// init map for CREATE new event modal window
function initMap() {
		if (!document.getElementById('map')) {
			return;
		}
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 34.044844, lng: -118.458589},
	   		zoom: 13,
	   		mapTypeId: google.maps.MapTypeId.ROADMAP,
	   		mapTypeControl: false
	   	});

		// Create the search box and link it to the UI element.
		var input = document.getElementById('pac-input');
		var searchBox = new google.maps.places.SearchBox(input);
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		// Bias the SearchBox results towards current map's viewport.
		map.addListener('bounds_changed', function() {
			searchBox.setBounds(map.getBounds());
		});

		var markers = [];
		// [START region_getplaces]
		// Listen for the event fired when the user selects a prediction and retrieve
		// more details for that place.
		searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
	
		if (places.length == 0) {
		  return;
		}
	
		// Clear out the old markers.
		markers.forEach(function(marker) {
		  marker.setMap(null);
		});
		markers = [];

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
		var icon = {
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(25, 25)
		};

		// Create a marker for each place.
		markers.push(new google.maps.Marker({
			map: map,
			icon: icon,
			title: place.name,
			position: place.geometry.location
		}));
		// console.log(place);

		// fill out form 
		fillOTSForm(place);
		//fillRTSForm(place);

		if (place.geometry.viewport) {
		  // Only geocodes have viewport.
		  bounds.union(place.geometry.viewport);
		} else {
		  bounds.extend(place.geometry.location);
		}
	});
	map.fitBounds(bounds);
  });
  // [END region_getplaces]
}

// init map for EDIT modal window
function initMapEdit() {
	if (!document.getElementById('map_edit')) {
		return;
	}
	map_edit = new google.maps.Map(document.getElementById('map_edit'), {
	   center: {lat: 34.044844, lng: -118.458589},
	   zoom: 13,
	   mapTypeId: google.maps.MapTypeId.ROADMAP,
	   mapTypeControl: false
	});

		// Create the search box and link it to the UI element.
		var input = document.getElementById('pac-input_edit');
		var searchBox = new google.maps.places.SearchBox(input);
		map_edit.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		// Bias the SearchBox results towards current map's viewport.
		map_edit.addListener('bounds_changed', function() {
			searchBox.setBounds(map.getBounds());
		});

		markers_edit = [];
		// [START region_getplaces]
		// Listen for the event fired when the user selects a prediction and retrieve
		// more details for that place.
		searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
	
		if (places.length == 0) {
		  return;
		}
	
		// Clear out the old markers.
		markers_edit.forEach(function(marker) {
		  marker.setMap(null);
		});
		markers_edit = [];

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();

		places.forEach(function(place) {
		var icon = {
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(25, 25)
		};

		// Create a marker for each place.
		markers_edit.push(new google.maps.Marker({
			map: map_edit,
			icon: icon,
			title: place.name,
			position: place.geometry.location
		}));
		
		

		// fill out form 
		fillOTSForm(place);
		//fillRTSForm(place);

		if (place.geometry.viewport) {
		  // Only geocodes have viewport.
		  bounds.union(place.geometry.viewport);
		} else {
		  bounds.extend(place.geometry.location);
		}
		

	});
	map_edit.fitBounds(bounds);
	map_edit.setZoom(15);

  });
  // [END region_getplaces]
}


function fillOTSForm(place) {
	// select ADD or EDIT modal window is opened now
	modal = ""
	if ($('#modalEditOTS').hasClass('in')) {
		modal = $('#modalEditOTS');
	} else if ($('#modalAddOTS').hasClass('in')) {
		modal = $('#modalAddOTS');
	} else if ($('.modal-edit').hasClass('in')) {
		modal = $('.modal-edit');
	} else if ($('.modal-add').hasClass('in')) {
		modal = $('.modal-add');
	} else {
		return;
	}
	// select OTS or RTS


	// modal.find( "#location" ).val(place.name);
	modal.find( "#lat" ).val(place.geometry.location.lat());
	modal.find( "#lng" ).val(place.geometry.location.lng());
	$.each(place.address_components, function(ind, val) {
		switch(val.types[0]) {
			case 'street_number':
				modal.find( "#address" ).val(val.short_name);
				break;
			case 'route':
				modal.find( "#address" ).val(modal.find( "#address" ).val() + ' ' + val.short_name);
				break;      
			case 'locality':
				modal.find( "#city" ).val(val.short_name);
				break;
			case 'administrative_area_level_1':
				modal.find( "#state" ).val(val.short_name);
				break;
			case 'country':
				modal.find( "#country" ).val(val.short_name);
				break;
			case 'postal_code':
				modal.find( "#zip" ).val(val.short_name);
				break;
		}
	})

}


function fillRTSForm(place) {
	modal = ""
	if ($('#modalEditOTS').hasClass('in')) {
		modal = $('#modalEditOTS');
	} else if ($('#modalAddOTS').hasClass('in')) {
		modal = $('#modalAddOTS');
	} else if ($('#modalEditRTS').hasClass('in')) {
		modal = $('#modalEditRTS');
	} else if ($('#modalAddRTS').hasClass('in')) {
		modal = $('#modalAddRTS');
	} else if ($('#modalAddSPE').hasClass('in')) {
		modal = $('#modalAddSPE');
	} else {
		return;
	}

	modal.find( "#location" ).val(place.name);
	
	modal.find( "#lat" ).val(place.geometry.location.lat());
	modal.find( "#lng" ).val(place.geometry.location.lng());
	$.each(place.address_components, function(ind, val) {
		switch(val.types[0]) {
			case 'street_number':
				modal.find( "#address" ).val(val.short_name);
				break;
			case 'route':
				modal.find( "#address" ).val(modal.find( "#address" ).val() + ' ' + val.short_name);
				break;      
			case 'locality':
				modal.find( "#city" ).val(val.short_name);
				break;
			case 'administrative_area_level_1':
				modal.find( "#state" ).val(val.short_name);
				break;
			case 'country':
				modal.find( "#country" ).val(val.short_name);
				break;
			case 'postal_code':
				modal.find( "#zip" ).val(val.short_name);
				break;
		}
	})

}

function updateEvent () {
	// console.log(window.location.pathname + '/');

	if($('.modal-edit').find('form')[0].checkValidity()) {
        //your form execution code   

		var input = ($('.modal-edit').find('form').serialize());
		
		 $.ajax({
	            type: 'POST', //hide url
	            url: $('.modal-edit').find('form').attr('action')+'/AJAX', //your form validation url
	            // processData: false, // file uploading
	            // contentType: false, // file uploading
	            data: input,
	            async: false,

	            success: function (data, e) {
	            	console.log('suc');
	            	console.log(data);

	            	// getList();
	            	
	            	$('#location-'+data.id).html(data.location);
	            	$('#host-'+data.id).html(data.host);
	            	$('#address-'+data.id).html(data.address);
	            	$('#address2-'+data.id).html(data.address2);
	            	$('#city-'+data.id).html(data.city);
	            	$('#state-'+data.id).html(data.state);
	            	$('#zip-'+data.id).html(data.zip);
	            	$('#country-'+data.id).html(data.country);
	            	$('#phone-'+data.id).html(data.phone);
	            	$('#email-'+data.id).html(data.email);


	            }, error: function(data) {
	            	console.log('err')
	            	console.log(data)
	            }

	        });

		 if ($('.modal-edit').hasClass('in')) {
		 	$('.modal-edit').modal('toggle');
		 }
	 } else {
	 	console.log("invalid form");
	 }
}



//ReADY

$(document).ready(function() {
	
	// "Delete All" confirmation modal
	$('#confirm-delete').on('show.bs.modal', function(e) {		
    	$(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
	});

	// Multi Upload function
	$('form[name="multiUpload"]').on('submit', function (e) {
		console.log($('form[name="multiUpload"]').serialize())
		var form = $('form[name="multiUpload"]')[0];
		var formData = new FormData(form);
		console.log(formData);
		$('.loading-gif').show();

        e.preventDefault(); //prevent to reload the page

        // Send EXCEL file to PHP parser and get back objects
        $.ajax({
            type: 'POST', //hide url
            url: $('form[name="multiUpload"]').attr('action'), //your form validation url
            processData: false, // file uploading
            contentType: false, // file uploading
            data: formData,
            async: false,

            success: function (data, e) {
            	if(data.events) {
            	// console.log(data); //display an alert whether the form is submitted okay			
				var time = 150;
				var count = 0;				
				// For each returned event object request for GEOLOCATION
				// and send coordinates to database
				$.each(data.events, function(key, event) {
					setTimeout( function(){ 

	  					var url = "https://maps.googleapis.com/maps/api/geocode/json?" + "key=" + "AIzaSyDCrNfHx2HuxRAGFX_ZB4o2y_ZIGPhSid4&"+"sensor=false&address=" + event.address + ",+" + event.city + ",+ " + event.state;
	    				// var new_url = url.replace(/ /g, '%20');

	    				// send request to Google Maps API
	    				// and updating coords 
	    				updateAjax(url, event);

						count++;
						$('.progress-bar').width(count * 100 / data.events.length+'%');
						// When the last record is processed hide modal and get errors
						if (count == data.events.length || data.events.length==0) {
							$('.loading-gif').hide();
							$('#modalMultiAddRTS').modal('toggle');		
							getErrors(data.errors);		

						}
					}, time);

					time += 110;
    						
				});

				getList();
				getErrors(data.errors);
   				
				} else {
					console.log(data);
					getErrors(data.errors);
					$('.loading-gif').hide();
					$('#modalMultiAddRTS').modal('toggle');				
				}

            },
            error: function(d, e) {
            	console.log('errors');
            	if ( typeof d != 'undefined' && d instanceof Array ) {
            		
            	} else {
            		d = []
            		d.errors = []
            	} 

            	d.errors.push('error: ' + d.statusText );
				
				getErrors(d.errors);
				
				 //display an alert whether the form is submitted okay
   				$('.loading-gif').hide();
   				$('#modalMultiAddRTS').modal('toggle');	
            }
        });          	          
    });

	function updateAjax(url, event ) {
		errors = []
		$.ajax({
		    type: 'GET', //hide url
		    url: url,
		    // processData: false, // file uploading
		    // contentType: false, // file uploading
		    // data: formData,
		    // async: false,

		    success: function (dat, e) {
		    	// console.log(dat.results)
		    	// console.log(dat.results[0])
		    	// console.log(dat)
		    	

		    	if(typeof dat.results[0] !== 'undefined') {
		    		lat = dat.results[0].geometry.location.lat;
					lng = dat.results[0].geometry.location.lng;  
					event.lat = lat;
					event.lng = lng;
				
					if (dat.status == "OK") {
			 		
						$.ajax({
							type: 'GET', //hide url
		    				url: window.location.href +'/'+event.id+'/update',
		    				contentType: "application/json; charset=utf-8",
							// dataType: "json",
		    				data: 
		    					{
							        // "_token": "{{ csrf_token() }}",
							        "lat": lat,
							        "lng" : lng
						        },
		    				success: function(response, status) {
		    					// console.log('success ::::' +response)
		    					// console.log(response)
		    				},
		    				error: function(er ,status) {
		    					// console.log('error ::::')
		    					console.log(er)
		    					console.log(status)
		    					// errors.push('error: ' + event.address + ",+" + event.city + ",+ " + event.state)
		    					// getErrors(errors)
		    					setTimeout(updateAjax(url, event), 150);
		    				}
						})
					} else if (dat.status == 'OVER_QUERY_LIMIT') {
						setTimeout(updateAjax(url, event), 150);
					} else {
						console.log(dat.status)
						errors.push('error: ' + event.address + ",+" + event.city + ",+ " + event.state )
						getErrors(errors)

					}
				} else {
					console.log(dat.status)
					errors.push(dat.status + ' : ' + event.address + ",+" + event.city + ",+ " + event.state )
					getErrors(errors)
				}

		    },
		    error: function(fail) {
		    		console.log(fail)
				
			    	errors.push('Check coordinates : ' + event.address + ", " + event.city + ", " + event.state)
			    	getErrors(errors)
		    }
		})
	}

	function getErrors(data) {		
		if (data.length >0) {

			$.each(data, function(key, error) {

				var tr = document.createElement('div');
		        tr.className ='alert alert-danger alert-dismissable';
		        tr.innerHTML +='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
		        tr.innerHTML +='<strong>' + 'Error: ' + error +  '</strong>';
				$('#header-row').append(tr);				
			})
        }		
	}
		

})


	var path = window.location.pathname;
	var event_type = path.substr(path.length - 3);
	// change action in modal forms depending on the route
	$('#modalAddRTS').find('form').attr('action', event_type+'/addNew');
	$('#modalMultiAddRTS').find('form').attr('action', event_type+'/multiUpload');
	

	// KINDA ROUTER
	function getList() {

	var url = window.location.href;

	$('table.main-list tbody tr').remove(); 
		
	if (event_type == 'rts') {
		console.log(path);
		$('#rts_link').addClass('active');
		$.ajax({
			url: window.location.pathname + '/getAllRegionals', 
			type: 'GET', 
			dataType: 'json', 
			success: getRegionals
		});
	} else if (event_type == 'ots') {


		$('#ots_link').addClass('active');
		console.log('ots')
		$.ajax({
			url: window.location.pathname +  '/getAllStores' , 
			type: 'GET', 
			dataType: 'json', 
			success: function(data) {
				getAllStores(data);	
			} 
		});
	} else if (event_type == 'spe') {
		$('#spe_link').addClass('active');
		console.log('spe')
		$.ajax({
			url: (window.location.pathname  + '/getAllSneakPeeks '), 
			type: 'GET', 
			dataType: 'json', 
			success: getSneakPeeks
		});
	}
}
getList();



// LISTING
function getAllStores(data, textStatus, XMLHttpRequest) {
			//console.log(data);
	$.each(data, function(k, v) {
				
				var dt = (v.duel_terminal == 'Yes' || v.duel_terminal == 'yes' || v.duel_terminal == 1) ?
						  'Yes' :  'No';
				var active = (v.active == 'Yes' || v.active == 'yes' || v.active == 1) ?
						  'Yes' :  'No';

				var tr = document.createElement('tr');
        		tr.id='table_row_'+v.id;
        		tr.innerHTML +='<td>' + v.id +  '</td>';
        		tr.innerHTML +='<td>'
        		+ '<button type="button" onclick="getStore(' +v.id+')" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modalEditOTS" title="Edit Store">#</button>'
        		+ '<a href="ots/' +v.id+ '/delete" class="btn btn-primary btn-sm" title="Delete Store">x</a>'
        		+ '</td>';
        		tr.innerHTML +='<td>' + v.location +  '</td>';
        		tr.innerHTML +='<td>' + v.address +  '</td>';
        		tr.innerHTML +='<td>' + v.city +  '</td>';
        		tr.innerHTML +='<td>' + v.state +  '</td>';
        		tr.innerHTML +='<td>' + v.zip +  '</td>';
        		tr.innerHTML +='<td>' + v.country +  '</td>';
        		tr.innerHTML +='<td>' + v.phone +  '</td>';
        		tr.innerHTML +='<td>' + v.email +  '</td>';
        		tr.innerHTML +='<td>' + dt +  '</td>';
        		// tr.innerHTML +='<td>' + v.lat +  '</td>';
        		// tr.innerHTML +='<td>' + v.lng +  '</td>';
        		tr.innerHTML +='<td width="10%">' + v.schedule +  '</td>';
        		// tr.innerHTML +='<td>' + v.type +  '</td>';
        		tr.innerHTML +='<td>' + active +  '</td>';

        		var featured = (v.featured == 'Yes' || v.featured == 'yes' || v.featured == 1) ?
						  'Yes' :  'No';
				var remote_duel = (v.remote_duel == 'Yes' || v.remote_duel == 'yes' || v.remote_duel == 1) ? 'Yes' :  'No';
				tr.innerHTML +='<td>' + featured +  '</td>';
				tr.innerHTML +='<td>' + remote_duel +  '</td>';
				// var featured_url = (v.featured_url == 'Yes' || v.featured_url == 'yes' || v.featured_url == 1) ?
				// 		  'Yes' :  'No';
				// tr.innerHTML +='<td>' + featured_url +  '</td>';
				
				$('table.main-list').find('tbody')[0].appendChild(tr);	
	});
};
function getRegionals(data, textStatus, XMLHttpRequest) {	
	$.each(data, function(k, v) {
				var tr = document.createElement('tr');
        		tr.id='table_row_'+v.id;
        		tr.innerHTML +='<td>' + v.id +  '</td>';
        		tr.innerHTML +='<td>'
        		+ '<button type="button" onclick="getSPE(' +v.id+')" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modalEditRTS" title="Edit Store">#</button>'
        		+ '<a href="rts/' +v.id+ '/delete" class="btn btn-primary btn-sm" title="Delete Store">x</a>'
        		+ '</td>';
        		tr.innerHTML +='<td id="location-'+v.id+'">' + v.location +  '</td>';
        		tr.innerHTML +='<td id="host-'+v.id+'">' + v.host +  '</td>';
        		tr.innerHTML +='<td id="address-'+v.id+'">' + v.address +  '</td>';
        		tr.innerHTML +='<td id="address2-'+v.id+'">' + v.address2 +  '</td>';
        		tr.innerHTML +='<td id="city-'+v.id+'">' + v.city +  '</td>';
        		tr.innerHTML +='<td id="state-'+v.id+'">' + v.state +  '</td>';
        		tr.innerHTML +='<td id="zip-'+v.id+'">' + v.zip +  '</td>';
        		tr.innerHTML +='<td id="country-'+v.id+'">' + v.country +  '</td>';
        		tr.innerHTML +='<td id="phone-'+v.id+'">' + v.phone +  '</td>';
        		tr.innerHTML +='<td id="email-'+v.id+'">' + v.email +  '</td>';
        		// tr.innerHTML +='<td>' + v.lat +  '</td>';
        		// tr.innerHTML +='<td>' + v.lng +  '</td>';

				$('table.main-list').find('tbody')[0].appendChild(tr);	
	});
};
function getSneakPeeks(data, textStatus, XMLHttpRequest) {	
	
	$.each(data, function(k, v) {
				var tr = document.createElement('tr');
        		tr.id='table_row_'+v.id;
        		tr.innerHTML +='<td>' + v.id +  '</td>';
        		tr.innerHTML +='<td>'
        		+ '<button type="button" onclick="getSPE(' +v.id+')" class="btn btn-primary btn-sm" data-toggle="modal" data-target=".modal-edit" title="Edit Store">#</button>'
        		+ '<a href="spe/' +v.id+ '/delete" class="btn btn-primary btn-sm" title="Delete Store">x</a>'
        		+ '</td>';
        		tr.innerHTML +='<td id="location-'+v.id+'">' + v.location +  '</td>';
        		tr.innerHTML +='<td id="host-'+v.id+'">' + v.host +  '</td>';
        		tr.innerHTML +='<td id="address-'+v.id+'">' + v.address +  '</td>';
        		tr.innerHTML +='<td id="address2-'+v.id+'">' + v.address2 +  '</td>';
        		tr.innerHTML +='<td id="city-'+v.id+'">' + v.city +  '</td>';
        		tr.innerHTML +='<td id="state-'+v.id+'">' + v.state +  '</td>';
        		tr.innerHTML +='<td id="zip-'+v.id+'">' + v.zip +  '</td>';
        		tr.innerHTML +='<td id="country-'+v.id+'">' + v.country +  '</td>';
        		tr.innerHTML +='<td id="phone-'+v.id+'">' + v.phone +  '</td>';
        		tr.innerHTML +='<td id="email-'+v.id+'">' + v.email +  '</td>';
        		// tr.innerHTML +='<td>' + v.lat +  '</td>';
        		// tr.innerHTML +='<td>' + v.lng +  '</td>';

				$('table.main-list').find('tbody')[0].appendChild(tr);	
	});
};

function filter() {

	value = $('#search').val().toLowerCase();

	var rows = $('table.main-list tbody tr');
	rows.show().filter( function() {			
			return $(this).text().toLowerCase().indexOf(value) == -1; ;
		}            
    ).hide();
    //$( "#jsonRegionals tr:contains('"+value+"')" ).show();
}


// AJAX get store
	function getSPE(id) {
		console.log(event_type);
		$.get( "./"+event_type + '/'+id, function( data ) {
			// change form action for update
			$('.modal-edit').find('form').attr('action', event_type+'/'+id);
			
			// $('#update-button').attr('onclick', 'updateEvent(' + event_type+','+ id + ')');

			$('.modal-edit').find('#location').val(data.location);
			$('.modal-edit').find('#host').val(data.host);
			$('.modal-edit').find('#address').val(data.address);
			$('.modal-edit').find('#address2').val(data.address2);
			$('.modal-edit').find('#city').val(data.city);
			$('.modal-edit').find('#state').val(data.state);
			$('.modal-edit').find('#zip').val(data.zip);
			$('.modal-edit').find('#country').val(data.country);
			$('.modal-edit').find('#phone').val(data.phone);
			$('.modal-edit').find('#email').val(data.email);
		
			$('.modal-edit').find('#lat').val(data.lat);
			$('.modal-edit').find('#lng').val(data.lng);


			$('.modal-title').html(data.location + ' Location') ;

			// clear events table before adding
			$('.modal-edit').find('table tbody').remove();
			$.each(data.events, function( index, event ) {
				
				eventsTableCreate(event, event_type);	

			});
			
			$(".modal-edit").on("shown.bs.modal", function () {
				var pt = new google.maps.LatLng(data.lat, data.lng);
				

				// $.get( "https://maps.googleapis.com/maps/api/geocode/json?address=" + data.address + ",+" + data.city + ",+ " + data.state + "&key={{ env('GOOGLE_API_KEY') }}", function( data ) {
				// 	//var currentLocation = new google.maps.LatLng(data.lat, data.lng);
				// 	map_edit.setCenter(data.results[0].geometry.location);
					
					// Clear out the old markers.
					
					markers_edit.forEach(function(marker) {
					  marker.setMap(null);
					});
					markers_edit=[]

					markers_edit.push(new google.maps.Marker({
						map: map_edit,
						
						title: data.location,
						position: pt
					}));
				// });

				map_edit.setCenter(pt);
			});
		});
		

		function eventsTableCreate(event, event_type) {
		    var body = $('#modalEditRTS').find('table')[0];
		// if event = RTS 
		// if event = SPE - other columns 
		    
			if(event_type == 'spe') {
				var body = $('#modalEditSPE').find('table')[0];
		    	var tbdy = document.createElement('tbody');
		    
		        var tr = document.createElement('tr');
		        tr.id='event_row_'+event.id;
		        tr.innerHTML = '<th scope="row"></th>';
		        tr.innerHTML += '<td>' + '<button type="button" onclick="deleteOneEvent(' + event.id + ')" class="btn btn-primary btn-sm" title="Delete Store">x</button>' 			
		        		+'</td>';
		     
				
				tr.innerHTML += '<input type="hidden" name="event_id[]" value="'+event.id+'">';
				
				id_event = (event.id_regional) ? event.id_regional : event.id_sneak_peek;
				tr.innerHTML += '<td>' + '<input type="hidden" class="form-control" name="id_regional[]" value="'+id_event+'">' +'</td>';;
				
				tr.innerHTML += '<td>'	+ '<input class="form-control" name="event_name[]" type="text" value="' + event.event_name + '">' +'</td>';

				// Event data
				tr.innerHTML += '<td>'	+ '<input class="form-control" name="date[]" type="date" value="' + event.date + '">' +'</td>';
				// Event time
				tr.innerHTML += '<td>'	+ '<input class="form-control" name="time[]" type="time" value="' + event.time + '">' +'</td>';



		        tbdy.appendChild(tr);
		    
		    	body.appendChild(tbdy)
			} else if (event_type == 'rts') {
				var body = $('#modalEditRTS').find('table')[0];
		    	var tbdy = document.createElement('tbody');
		    
		        var tr = document.createElement('tr');
		        tr.id='event_row_'+event.id;
		        tr.innerHTML = '<th scope="row"></th>';
		        tr.innerHTML += '<td>' + '<button type="button" onclick="deleteOneEvent(' + event.id + ')" class="btn btn-primary btn-sm" title="Delete Store">x</button>' 			
		        		+'</td>';
		     
				
				tr.innerHTML += '<input type="hidden" name="event_id[]" value="'+event.id+'">';
				id_event = (event.id_regional) ? event.id_regional : event.id_sneak_peek;
				tr.innerHTML += '<td>' + '<input type="hidden" class="form-control" name="id_regional[]" value="'+id_event+'">' +'</td>';;
				
				// Event date
				tr.innerHTML += '<td>'	+ '<input class="form-control" name="date[]" type="date" value="' + event.date + '">' +'</td>';
				// Event time
				tr.innerHTML += '<td>'	+ '<input class="form-control" name="time[]" type="time" value="' + event.time + '">' +'</td>';

				tr.innerHTML += '<td>'	+ '<select class="form-control" name="dragon_duel[]" id="dragon_duel_'+event.id+'">'
										+'<option value=1>Yes</option>'
										+'<option value=0>No</option>'
										+'</select>' +'</td>';
				// Capacity								
				tr.innerHTML += '<td>'	+ '<input class="form-control" name="capacity[]" type="number" value="' + event.cap + '">' +'</td>';
				// Completed results
				tr.innerHTML += '<td>'	+ '<select class="form-control" name="completed_results[]" id="completed_results_'+event.id+'">'
										+'<option value=1>Yes</option>'
										+'<option value=0>No</option>'
										+'</select>' +'</td>';
				// Save button
				// tr.innerHTML += '<td>'+ '<button type="button" onclick="" class="btn btn-primary btn-sm" title="Save event"><</button>' +'</td>';

		        tbdy.appendChild(tr);
		    
		    body.appendChild(tbdy)
		    
		    // set SELECTS values
		    $('#modalEditRTS').find('table').find('#dragon_duel_'+event.id+'').val((event.dragon_duel == 1 
		    	|| event.dragon_duel == 'yes' 
		    	|| event.dragon_duel == 'Yes') ? 1 : 0);
		    $('#modalEditRTS').find('table').find('#completed_results_'+event.id+'').val((event.completed_results == 1 
		    	|| event.completed_results == 'yes' 
		    	|| event.completed_results == 'Yes') ? 1 : 0);

		    // Create objects
				//saveEvents();
			}
		}
	}

