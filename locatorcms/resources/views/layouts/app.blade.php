<!DOCTYPE html>
<html>
<head>
	<title></title>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<link rel="stylesheet" type="text/css" href="{{ url('/') }}/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="{{ url('/') }}/css/style.css">
	<style>

</style>
</head>
<body>


<div class="container-fluid">
<div class="row bg-primary">
	<div class="col-md-10">
		<h6>YuGiOh locator CMS</h6>
	</div>
	<div class="col-md-2 ">
	
		
		<a class="btn btn-primary pull-right" href="{{ route('logout') }}"
			onclick="event.preventDefault();
					 document.getElementById('logout-form').submit();">
			Logout
		</a>

		<form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
			{{ csrf_field() }}
		</form>
	</div>  
</div>
<div id="header-row" class="row">
@if (count($errors) > 0)
	@foreach ($errors->all() as $error)	
	<div class="alert alert-danger alert-dismissable">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong>{{ $error }}</strong>	
	</div>
	@endforeach
@endif



	<div class="col-md-12">
		@include('header')  
	</div>  
</div>

<div class="row">
	<div class="col-md-2">
		@section('sidebar')
			<div class="list-group">
				  <a id="ots_link" href="ots" class="list-group-item ">Official Tournament Store</a>
				  <a id="rts_link" href="rts" class="list-group-item ">Regional Qualifier Location</a>
				  <a id="spe_link" href="spe" class="list-group-item ">Sneak Peek Event</a>
			</div>
		@show
	</div>
	<div class="col-md-10">
		@yield('main')
	</div>
</div>
</div>
</body>

<script src="{{ url('/') }}/js/jquery.min.js"></script>
<script src="{{ url('/') }}/js/bootstrap/bootstrap.min.js"></script>
<!-- <script src="https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script> -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script> -->


<script src="{{ url('/') }}/js/script.js"></script>
<script src="{{ url('/') }}/js/home.js"></script>
<script src="{{ url('/') }}/js/jquery.tablesorter.min.js"></script>

<script>
	// script for accessing to google maps api
	function loadScript() {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_API_KEY') }}&language=en&libraries=places&callback=initAutocomplete';
		document.body.appendChild(script);
	}
	window.onload = loadScript();
</script>

<script src=""  async defer></script>

<!-- https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=cruise&key=YOUR_API_KEY -->
</html>



