

<!-- Modal -->
<div class="row">
<div class="modal fade" id="modalMultiAddRTS" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Add multiple locations</h4>
				
				<div class="progress">
				  <div class="progress-bar" role="progressbar" aria-valuenow="0"
				  aria-valuemin="0" aria-valuemax="100" style="width:0%">
				    <span class="sr-only">70% Complete</span>
				  </div>
				</div>
			</div>
			<div class="modal-body">
				<form name="multiUpload" action="{{ Request::url() }}/multiUploadRTS" method="POST" enctype="multipart/form-data">
					
					<div class="row">
						<div class="col-md-8">
							<input required="true" type="file" name="file" class="btn btn-primary" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
							<span>* EXCEL file</span>
						</div>
						<div class="col-md-2">
							<img class="loading-gif" hidden="true" width="50%" src="https://43things-hjzcjouerpdf8uu4h.stackpathdns.com/content/themes/material/images/loading.gif.pagespeed.ce.rW0NLCjdWa.gif" alt="">
						</div>
						<div class="col-md-2">
							<button type="submit" class="btn btn-primary">Import</button>	

						</div>
					</div>
					<input type="hidden" name="_token" value="{!! csrf_token() !!}">
				</form>
			</div>
		</div>
	</div>
</div>
</div>

<script>

</script>