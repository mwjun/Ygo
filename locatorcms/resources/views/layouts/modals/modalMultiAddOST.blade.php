

<!-- Modal -->
<div class="row">
<div class="modal fade" id="modalMultiAddOST" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Modal title</h4>
			</div>
			<div class="modal-body">
				<form action="{{ Request::url() }}/multiUploadOTS" method="POST" enctype="multipart/form-data">
					<input type="hidden" name="_token" value="{!! csrf_token() !!}">
					<div class="row">
						<div class="col-md-10">
							<input type="file" name="file" class="btn btn-primary">
						</div>
						<div class="col-md-2">
							<button type="submit" class="btn btn-primary">Import</button>				
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
</div>