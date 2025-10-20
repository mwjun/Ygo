
<!-- Modal -->
<div class="modal fade" id="modalAddOTS" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<form action="{{ url('/') }}/ots/addNewOTS" method="POST" id="modalAddOTS_Form">
				<input type="hidden" name="_token" value="{!! csrf_token() !!}">

				<!-- - - - - - - - -  MODAL HEADER  - - - - - - - - -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">Modal title</h4>
				</div>

				<!-- - - - - - - - -  MODAL BODY  - - - - - - - - -->
				<div class="modal-body">
					<div class="row">
						<div class="col-md-6">
						
							<label for="location" class="col-md-2 col-form-label">location</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="location" id="location" required="true" >
							</div>

							<label for="address" class="col-md-2 col-form-label">address</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="address" id="address" required="true" >
							</div>
							<label for="city" class="col-md-2 col-form-label">city</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="city" id="city">
							</div>
							<label for="state" class="col-md-2 col-form-label">state</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="state" id="state">
							</div>
							<label for="zip" class="col-md-2 col-form-label">zip</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="zip" id="zip">
							</div>
							<label for="country" class="col-md-2 col-form-label">country</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="country" id="country">
							</div>
							<label for="phone" class="col-md-2 col-form-label">phone</label>
							<div class="col-md-10">
								<input class="form-control" type="tel" value="" name="phone" id="phone">
							</div>
							<label for="email" class="col-md-2 col-form-label">email</label>
							<div class="col-md-10">
								<input class="form-control" type="email" value="" name="email" id="email">
							</div>

							<label for="duel_terminal" class="col-md-2 col-form-label">duel_terminal</label>				
							<div class="col-md-10">
								<select class="form-control col-md-10" name="duel_terminal" id="duel_terminal">
								  <option value=1>Yes</option>
								  <option value=0>No</option>
								</select>
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

							<label for="schedule" class="col-md-2 col-form-label">schedule</label>
							<div class="col-md-10">
								<textarea class="form-control" type="text" value="" name="schedule" id="schedule"></textarea>
							</div>
							<label for="type" class="col-md-2 col-form-label">type</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="" name="type" id="type">
							</div>

							<label for="active" class="col-md-2 col-form-label">active</label>
							<div class="col-md-10">		
								<select class="form-control"  name="active" id="active">
								  <option value=1>Yes</option>
								  <option value=0>No</option>
								</select>
							</div>

							<label for="featured" class="col-md-2 col-form-label">featured</label>
							<div class="col-md-10">		
								<select class="form-control"  name="featured" id="featured">
								  <option value=1>Yes</option>
								  <option value=0>No</option>
								</select>
							</div>
							<label for="featured_url" class="col-md-2 col-form-label">featured URL</label>
							<div class="col-md-10">		
								<input class="form-control" type="number" name="featured_url" value="" id="featured_url" step="any">
							</div>
							<label for="remote_duel" class="col-md-2 col-form-label">Remote Duel</label>
							<div class="col-md-10">		
								<select class="form-control"  name="remote_duel" id="remote_duel">
								  <option value=1>Yes</option>
								  <option value=0>No</option>
								</select>
							</div>
						</div> <!-- col-md-8 -->
						<div class="col-md-6">							
							<span>Enter the address here first</span>
							<input id="pac-input" class="controls" type="text" placeholder="Search Box">
							<div id="map"></div>
							
						</div> <!-- col-md-4 -->
					</div> <!-- row -->


				<!-- 	<label for="example-date-input" class="col-md-2 col-form-label">Date</label>
					<div class="col-md-10">
						<input class="form-control" type="date" value="2011-08-19" id="example-date-input">
					</div>

					<label for="example-time-input" class="col-md-2 col-form-label">Time</label>
					<div class="col-md-10">
						<input class="form-control" type="time" value="13:45:00" id="example-time-input">
					</div> -->
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
