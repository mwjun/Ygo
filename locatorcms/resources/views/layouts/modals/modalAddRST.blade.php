<!-- Modal -->
<div class="modal fade modal-add" id="modalAddRTS" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<form action="{{ url('/') }}/rts/addNewRTS" method="POST" id="modalAddRTS_Form">
				<input type="hidden" name="_token" value="{!! csrf_token() !!}">

				<!-- - - - - - - - -  MODAL HEADER  - - - - - - - - -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">Create new location</h4>
				</div>

				<!-- - - - - - - - -  MODAL BODY  - - - - - - - - -->
				<div class="modal-body">
					<div class="row">
						<div class="col-md-6">
							<span>All form fields are required</span>
							<br>
							<label for="location" class="col-md-2 col-form-label">Location</label>
							<div class="col-md-10">
								<input required="true" class="form-control" type="text" value="{{ old('location') }}" name="location" id="location">
							</div>
							<label for="host" class="col-md-2 col-form-label">Host</label>
							<div class="col-md-10">
								<input required="true" class="form-control" type="text" value="{{ old('host') }}" name="host" id="host">
							</div>
							<label for="address" class="col-md-2 col-form-label">Address</label>
							<div class="col-md-10">
								<input required="true" class="form-control" type="text" value="{{ old('address') }}" name="address" id="address">
							</div>
							<label for="address2" class="col-md-2 col-form-label">Address2</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="{{ old('address2') }}" name="address2" id="address2">
							</div>
							<label for="city" class="col-md-2 col-form-label">City</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="city" id="city">
							</div>
							<label for="state" class="col-md-2 col-form-label">State</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="state" id="state">
							</div>
							<label for="zip" class="col-md-2 col-form-label">ZIP</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="zip" id="zip">
							</div>
							<label for="country" class="col-md-2 col-form-label">Country</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="country" id="country">
							</div>
							<label for="phone" class="col-md-2 col-form-label">Phone</label>
							<div class="col-md-10">
								<input class="form-control" type="tel" value="" name="phone" id="phone">
							</div>
							<label for="email" class="col-md-2 col-form-label">email</label>
							<div class="col-md-10">
								<input class="form-control" type="email" value="" name="email" id="email">
							</div>
							<div class="row">
								<div class="col-md-6">
									<label for="lat" class="col-md-2 col-form-label">lat</label>
									<div class="col-md-10">
										<input class="form-control" type="number" name="lat" value="" id="lat" step="any">
									</div>	
								</div>								
								<div class="col-md-6">
									<label for="lng" class="col-md-2 col-form-label">lng</label>
									<div class="col-md-10">
										<input class="form-control" type="number" name="lng" value="" id="lng" step="any">
									</div>	
								</div>
							</div>
						</div> <!-- col-md-8 -->
						<div class="col-md-6">
							
							<span>Enter the address or host name here first</span>
							<input id="pac-input" class="controls" type="text" placeholder="Search Box">
							<div id="map"></div>

						</div> <!-- col-md-4 -->
					</div> <!-- row -->
					<hr>
					<div class="row">
						<div class="col-md-12">
							<h5>Create Events</h5>
						</div>
					</div>
					<div class="row">
						<table class="table table-striped">
							<thead>
								<tr>
									<th>#</th>
									<th>Edit</th>
									<th>id_regional</th>
									<th>date</th>
									<th>time</th>
									<th>dragon_duel</th>
									<th>capacity</th>
									<th>completed_results</th>			
									<!-- <th>save</th>			 -->
								</tr>
							</thead>
							<tbody>							
									
					
							</tbody>
						</table>
						<button type="button" onclick="emptyTableCreate('Add')" class="btn btn-primary btn-sm pull-right" title="Add Event">+</button>
					</div>
				</div>
				<!-- - - - - - - - -  MODAL FOOTER  - - - - - - - - -->
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button type="submit" class="btn btn-primary">Save changes</button>
				</div>
			</form> <!-- form -->
		</div>
	</div>
</div>
