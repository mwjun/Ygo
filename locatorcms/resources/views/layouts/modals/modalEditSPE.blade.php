<style>


</style>

<!-- Modal -->
<div class="modal fade modal-edit" id="modalEditSPE" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<form action="{{ Request::url() }}/editOneSPE" method="POST" id="editSPEModalForm">
				<input type="hidden" name="_token" value="{!! csrf_token() !!}">

				<!-- - - - - - - - -  MODAL HEADER  - - - - - - - - -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="editRTSLabel">Edit </h4>
				</div>
				
				<!-- - - - - - - - -  MODAL BODY  - - - - - - - - -->
				<div class="modal-body">
					<div class="row">
						<div class="col-md-6">
							<span>All form fields are required</span>
							<br>
							<label for="location" class="col-md-2 col-form-label">location</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="test" name="location" id="location">
							</div>
							<label for="host" class="col-md-2 col-form-label">host</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="test" name="host" id="host">
							</div>
							<label for="address" class="col-md-2 col-form-label">address</label>
							<div class="col-md-10">
								<input class="form-control" type="text" name="address" id="address">
							</div>
							<label for="address2" class="col-md-2 col-form-label">address2</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="apt 7 test" name="address2" id="address2">
							</div>
							<label for="city" class="col-md-2 col-form-label">city</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="Artisanal kale" name="city" id="city">
							</div>
							<label for="state" class="col-md-2 col-form-label">state</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="Artisanal kale" name="state" id="state">
							</div>
							<label for="zip" class="col-md-2 col-form-label">zip</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="Artisanal kale" name="zip" id="zip">
							</div>
							<label for="country" class="col-md-2 col-form-label">country</label>
							<div class="col-md-10">
								<input class="form-control" type="text" value="Artisanal kale" name="country" id="country">
							</div>
							<label for="phone" class="col-md-2 col-form-label">phone</label>
							<div class="col-md-10">
								<input class="form-control" type="tel" value="+1-213-999-99-99" name="phone" id="phone">
							</div>
							<label for="email" class="col-md-2 col-form-label">email</label>
							<div class="col-md-10">
								<input class="form-control" type="email" value="bootstrap@example.com" name="email" id="email">
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
						</div>
						<div class="col-md-6">
							<span>Enter the address or host name here first</span>
							<input id="pac-input_edit" class="controls" type="text" placeholder="Search Box">
							<div id="map_edit"></div>
						</div>
					</div> <!-- row -->
					<div class="row">
					<div class="col-md-12">Create Events</div>
					</div>
					<div class="row">
						<table class="table table-striped">
							<thead>
								<tr>
									<th>#</th>
									<th>Edit</th>
									<th></th>
									<th>Event Name</th>
									<th>Date</th>
									<th>Time</th>
									<!-- <th>dragon_duel</th> -->
									<!-- <th>capacity</th> -->
									<!-- <th>completed_results</th>			 -->
									<!-- <th>save</th>			 -->
								</tr>
							</thead>
<!-- JQUERY ROWS -->
						</table>
						
						
					</div>
					<div class="row">
							<div class="col-md-12">
							<button type="button" onclick="emptyTableCreate('Edit')" class="btn btn-primary btn-sm pull-right" title="Add Event">+</button>	
							</div>
						</div>
				</div>

				<!-- - - - - - - - -  MODAL FOOTER  - - - - - - - - -->
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<!-- <button type="submit" class="btn btn-primary">Save changes</button> -->
					<button id="update-button" type="button" class="btn btn-primary" onclick="updateEvent()">Save changes</button>
				</div>
			</form> <!-- form -->
		</div>
	</div>
</div>