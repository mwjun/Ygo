@extends('layouts.app')

@section('sidebar')

	@parent
	<p>Official store</p>
@endsection

@section('main')

	<div class="row">

		<!-- Button trigger modal -->
			<div class="col-md-1">
				<button type="button" class="btn btn-primary pull-left" data-toggle="modal" data-target="#modalAddOTS" title="Add a single store">+</button>


			<!-- Button trigger modal -->
				<!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalMultiAddOST" title="Multi Upload">++</button> -->
			</div>
			<div class="col-md-10">
				<form class="form-horizontal">
				  <div class="form-group">
				    <label class="control-label col-sm-1" for="search">Search:</label>
				    <div class="col-sm-11">
				      <input id="search" name="search" class="form-control" oninput="filter()"></input>
				    </div>
				  </div>				
				</form>
			</div>
			<div class="col-md-1">
				<!-- <button class="btn btn-danger btn-primary pull-right" title="Delete All Stores" data-href="{{url('/ots/deleteAllOTS') }}" data-toggle="modal" data-target="#confirm-delete">x</button> -->


				<div class="modal fade" id="confirm-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				    <div class="modal-dialog">
				        <div class="modal-content">
				            <div class="modal-header">
				                <h3>Delete Official Stores</h3>
				            </div>
				            <div class="modal-body">
				                Are you sure you want to delete all Offical Stores?
				            </div>
				            <div class="modal-footer">
				                <form name="myform" action="{{url('/ots/deleteAllOTS') }}" method="post">
				                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				                <!-- <a class="btn btn-danger btn-ok">Delete</a> -->
				                
								<input type="hidden" name="_token" value="{!! csrf_token() !!}">
								  <button type="submit" class="btn btn-danger" title="Delete All Offical Stores">Delete</button>
								</form>
				            </div>
				        </div>
				    </div>
				</div>
			</div>	


	</div>


	
	<div>
		
	</div>
	@include('layouts.modals.modalEditOST')
	@include('layouts.modals.modalAddOST')
	@include('layouts.modals.modalMultiAddOST')
	<table class="table table-striped main-list">
		<thead class="bg-primary">
			<tr>		
				<th>#</th>
				<th  width="5%">Edit</th>
				<th><!-- <a href="{{ URL::to('/') }}/ots/location"> -->Location Name<!-- </a> --></th>
				<th>Address</th>
				<th>City</th>
				<th>State</th>
				<th>Zip</th>
				<th>Country</th>
				<th>Phone</th>
				<th>Email</th>
				<th>Duel Terminal</th>
				<!-- <th>lat</th> -->
				<!-- <th>lng</th> -->
				<th>schedule</th>
				<!-- <th>type</th> -->
				<th>active</th>
				<th>Featured</th>
				<th>Remote Duel</th>
			</tr>
		</thead>
		<tbody>

		</tbody>
	</table>

	<div id="ajaxBusy" style="display:none;">
		LOADING
	</div>

	<script type="text/javascript">



	// AJAX get store
	function getStore(id) {
		$.get( "{{ Request::url() . '/' }}" + id + '/getOneOTS', function( data ) {
			$('#modalEditOTS').find("#location").val(data.location);
			$('#modalEditOTS').find('#address').val(data.address);
			$('#modalEditOTS').find('#city').val(data.city);
			$('#modalEditOTS').find('#state').val(data.state);
			$('#modalEditOTS').find('#zip').val(data.zip);
			$('#modalEditOTS').find('#country').val(data.country);
			$('#modalEditOTS').find('#phone').val(data.phone);
			$('#modalEditOTS').find('#email').val(data.email);
			$('#modalEditOTS').find('#duel_terminal').val(data.duel_terminal);
			$('#modalEditOTS').find('#lat').val(data.lat);
			$('#modalEditOTS').find('#lng').val(data.lng);
			$('#modalEditOTS').find('#schedule').val(data.schedule);
			$('#modalEditOTS').find('#type').val(data.type);
			$('#modalEditOTS').find('#active').val(data.active);
			$('#modalEditOTS').find('#featured').val(data.featured);
			$('#modalEditOTS').find('#featured_url').val(data.featured_url);
			$('#modalEditOTS').find('#remote_duel').val(data.remote_duel);
			$('#modalEditOTS').find('#discord_invite').val(data.discord_invite);
			$('#editOTSLabel').html('Edit ' + data.location + ' Location') ;
			$('#editOTSModalForm').attr('action', '{!! Request::url() !!}' + '/' + id + '/editOneOTS' ); 

			
			let loc = {
            "lat" : data.lat,
            "lng" : data.lng
         	};

			map_edit.setCenter(loc);
			
			// Clear out the old markers.
			markers_edit=[]
			markers_edit.forEach(function(marker) {
			  marker.setMap(null);
			});

			markers_edit.push(new google.maps.Marker({
				map: map_edit,
				
				title: data.location,
				position: loc,
				// label: { color: '#00aaff', fontWeight: 'bold', fontSize: '14px', text: data.location }
			}));


			/*
			$.get( "https://maps.googleapis.com/maps/api/geocode/json?address=" + data.address + ",+" + data.city + ",+ " + data.state + "&key={{ env('GOOGLE_API_KEY') }}", function( data ) {
				console.log(data.results[0].geometry.location);
				//var currentLocation = new google.maps.LatLng(data.lat, data.lng);
				map_edit.setCenter(data.results[0].geometry.location);
				
				// Clear out the old markers.
				markers_edit=[]
				markers_edit.forEach(function(marker) {
				  marker.setMap(null);
				});

				markers_edit.push(new google.maps.Marker({
					map: map_edit,
					
					title: data.results[0].name,
					position: data.results[0].geometry.location
				}));
			})
			*/
		});



			

	}


		
	</script>

	
	









@endsection