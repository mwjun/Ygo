

// ability to open maps in modal window
$(".modal").on("shown.bs.modal", function () {
	console.log('map')
	google.maps.event.trigger(map, "resize");
	if (document.getElementById('map_edit')) {
		console.log('map_edit')
		google.maps.event.trigger(map_edit, "resize");
	}
	
		//map.setCenter(latlng);
});

$('.modal').on('hidden.bs.modal', function () {
    $(this).find( "#location" ).val('');
})

// Prevent modal form submission on Enter Key
$('.modal').on('keyup keypress', function(e) {
	var keyCode = e.keyCode || e.which;
	if (keyCode === 13) { 

		e.preventDefault();
		document.getElementById("schedule").value = document.getElementById("schedule").value + "\n";
		return false;
	}
});



		
// create events row HTML
function emptyTableCreate(type) {
	if (event_type == 'rts') {
    	var body = $('#modal'+type+'RTS').find('table')[0];   

    	var tbdy = document.createElement('tbody');
    
        var tr = document.createElement('tr');
        rand = Math.floor(Math.random()*1000);
        tr.id='tr_'+rand;
        tr.innerHTML = '<th scope="row"></th>';
        tr.innerHTML += '<td>' + '<button type="button" onclick="deleteNewEvent('+rand+')" class="btn btn-primary btn-sm" title="Delete Store">x</button>' 			
        		+'</td>';
     
		
		tr.innerHTML += '<input type="hidden" name="event_id[]" value="">';
		tr.innerHTML += '<td>' + '<input type="hidden" class="form-control" name="id_regional[]" value="">' +'</td>';;
		
		// Event date
		tr.innerHTML += '<td>'	+ '<input class="form-control" name="date[]" type="date">' +'</td>';
		// Event time
		tr.innerHTML += '<td>'	+ '<input class="form-control" name="time[]" type="time">' +'</td>';

		tr.innerHTML += '<td>'	+ '<select class="form-control" name="dragon_duel[]" id="dragon_duel_">'
								+'<option value=1>Yes</option>'
								+'<option value=0>No</option>'
								+'</select>' +'</td>';
		// Capacity								
		tr.innerHTML += '<td>'	+ '<input class="form-control" name="capacity[]" type="number" value="0">' +'</td>';
		// Completed results
		tr.innerHTML += '<td>'	+ '<select class="form-control" name="completed_results[]" id="completed_results_">'
								+'<option value=1>Yes</option>'
								+'<option value=0>No</option>'
								+'</select>' +'</td>';
		// Save button
		// tr.innerHTML += '<td>'+ '<button type="button" onclick="" class="btn btn-primary btn-sm" title="Save event"><</button>' +'</td>';

        tbdy.appendChild(tr);
    
   		body.appendChild(tbdy)
    } else if (event_type == 'spe') {
    	var body = $('#modal'+type+'SPE').find('table')[0];

    	var tbdy = document.createElement('tbody');
    
        var tr = document.createElement('tr');
        rand = Math.floor(Math.random()*1000);
        tr.id='tr_'+rand;
        tr.innerHTML = '<th scope="row"></th>';
        tr.innerHTML += '<td>' + '<button type="button" onclick="deleteNewEvent('+rand+')" class="btn btn-primary btn-sm" title="Delete Store">x</button>' 			
        		+'</td>';
     
		
		tr.innerHTML += '<input type="hidden" name="event_id[]" value="">';
		tr.innerHTML += '<td>' + '<input type="hidden" class="form-control" name="id_regional[]" value="">' +'</td>';;
		
		// Event date
		tr.innerHTML += '<td>'	+ '<input class="form-control" name="event_name[]" type="text">' +'</td>';
		// Event time
		tr.innerHTML += '<td>'	+ '<input class="form-control" name="date[]" type="date">' +'</td>';
		tr.innerHTML += '<td>'	+ '<input class="form-control" name="time[]" type="time">' +'</td>';

        tbdy.appendChild(tr);
    
   		body.appendChild(tbdy)
    }

}


function saveEvents() {
	var events = [];
	$.each($( "input[name^='event_id']" ) , function( key, value ) {
  		var event = {};
  		//event.push(value.value);
  		event.id_regional = ($( "input[name^='id_regional']" )[key].value);
  		event.event_id = ($( "input[name^='event_id']" )[key].value);
  		event.time = ($( "input[name^='time']" )[key].value);
  		
  		events.push(event);

  		
	});
	// console.log(events);
}

function deleteOneEvent(id) {

	$.get( window.location.href+'/events/' + id + '/delete', function( data ) {
		
	});

		$("#event_row_"+id+"").remove();

}
function deleteNewEvent(id) {
		$("#tr_"+id+"").remove();
}