@extends('layouts.app')



@section('sidebar')
<!-- <h6>regional </h6> -->
	@parent
	
@endsection

@section('main')



	
	
	<div class="row">

		<!-- Button trigger modal -->
			<div class="col-md-1">
				<button type="button" class="btn btn-primary pull-left" data-toggle="modal" data-target="#modalAddRTS" title="Add a single Regional Location">+</button>


			<!-- Button trigger modal -->
				<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalMultiAddRTS" title="Add multiple Regional Location by file" data-backdrop="static" data-keyboard="false">++</button>
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




				<button class="btn btn-primary pull-right" title="Delete All Regionals" data-toggle="modal" data-target="#confirm-delete">x</button>


				<div class="modal fade" id="confirm-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				    <div class="modal-dialog">
				        <div class="modal-content">
				            <div class="modal-header">
				                <h3>Delete Regionals</h3>
				            </div>
				            <div class="modal-body">
				                Are you sure you want to delete all Regionals?
				            </div>
				            <div class="modal-footer">
				                <form name="myform" action="{{url('/rts/deleteAllRTS') }}" method="post">
				                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
				                <!-- <a class="btn btn-danger btn-ok">Delete</a> -->
				                
								<input type="hidden" name="_token" value="{!! csrf_token() !!}">
								  <button type="submit" class="btn btn-danger" title="Delete All Regionals">Delete</button>
								</form>
				            </div>
				        </div>
				    </div>
				</div>

			</div>	


	</div>
	
	<div>
		
	</div>

	@include('layouts.modals.modalAddRST')
	@include('layouts.modals.modalEditRTS')
	@include('layouts.modals.modalMultiAddRTS')
	




	
	<table id="jsonRegionals" class="table table-striped main-list">
		<thead class="bg-primary">
			<tr>
				<th>#</th>
				<th  width="5%">Edit</th>
				<th><!-- <a href="{{ URL::to('/') }}/rts/location"> -->Location Name<!-- </a> --></th>
				<th>Host</th>
				<th>Address</th>
				<th>Address2</th>
				<th>City</th>
				<th>State</th>
				<th>Zip</th>
				<th>Country</th>
				<th>Phone</th>
				<th>Email</th>
				<!-- <th>lat</th> -->
				<!-- <th>lng</th> -->
			</tr>
		</thead>

		<tbody>

		</tbody>
	</table>

<div id="ajaxBusy" style="display:none;">
		LOADING
</div>
@endsection