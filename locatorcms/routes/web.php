<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::auth();
Route::group(['middleware' => ['auth']], function () {
	Route::get('/', ['as' =>'main', function () {
    	return redirect()->route('ots');
	}]);
    
	
	Route::get('/ots', ['as' =>'ots', 'uses' => 'OTSController@index']);
	//Route::get('/ots/{order}', ['as' =>'ots', 'uses' => 'OTSController@getOrderBy']);
	Route::get('/rts', ['as' =>'rts', 'uses' => 'RTSController@index']);

	Route::get('/spe', ['as' =>'spe_all', 'uses' => 'SPEController@index']);
	// Route::resource('spe', 'SPEController');
	
	

//ADMIN



// Official tournament store
Route::get('/ots/{id}/delete/', ['as' => 'delete_ots', 'uses' => 'OTSController@deleteOTS'])/*->middleware('auth', 'admin')*/; // ADD ADMIN MIDDLEWARE
Route::post('/ots/addNewOTS', ['as' =>'add_new_ots', 'uses' => 'OTSController@addNewOTS']);
Route::post('/ots/{id}/editOneOTS', ['as' =>'edit_one_ots', 'uses' => 'OTSController@editOneOTS']);
Route::get('/ots/{id}/getOneOTS', ['as' =>'get_one_ots', 'uses' => 'OTSController@getOneOTS']);
Route::post('/ots/multiUploadOTS', ['as' =>'import_ots', 'uses' => 'OTSController@multiUploadOTS']);
Route::post('/ots/deleteAllOTS', ['as' =>'delete_all_ots', 'uses' => 'OTSController@deleteAllOTS']);
Route::get('/ots/getAllStores', ['as' =>'show_all_ots', 'uses' => 'OTSController@showOts']);

//Regional
Route::post('/rts/addNew', ['as' =>'add_new_rts', 'uses' => 'RTSController@store']);
Route::get('/rts/{id}/delete/', ['as' => 'delete_rts', 'uses' => 'RTSController@destroy']);
Route::post('/rts/deleteAllRTS', ['as' =>'delete_all_rts', 'uses' => 'RTSController@deleteAllRTS']);
// Route::get('/rts/getRegionals/{value}', ['as' =>'get_rts', 'uses' => 'RTSController@getRegionals']);
Route::get('/rts/getAllRegionals/', ['as' =>'get_all_rts', 'uses' => 'RTSController@getAllRegionals']);
Route::post('/rts/multiUpload', ['as' =>'import_rts', 'uses' => 'RTSController@multiUploadRTS']);
Route::get('/rts/{id}', ['as' =>'get_one_rts', 'uses' => 'RTSController@show']);
Route::post('/rts/{id}', ['as' =>'edit_one_rts', 'uses' => 'RTSController@update']);
Route::post('/rts/{id}/AJAX', ['as' =>'edit_one_rts_AJAX', 'uses' => 'RTSController@updateAJAX']);
Route::get('/rts/{id}/update', ['as' =>'update_rts', 'uses' => 'RTSController@updateCoords']);
//Regional event
Route::get('rts/events/{id}/delete', ['as' =>'delete_one_event', 'uses' => 'RTSController@deleteOneEvent']);








// SNEAK PEEK
Route::get('/spe/getAllSneakPeeks/', ['as' =>'get_all_spe', 'uses' => 'SPEController@view']);


Route::get('/spe/{id}', ['as' =>'get_one_spe', 'uses' => 'SPEController@getOneSPE']);

Route::get('/spe/{id}/delete/', ['as' => 'delete_spe', 'uses' => 'SPEController@deleteSPE']);
Route::post('/spe/deleteAllSPE', ['as' =>'delete_all_spe', 'uses' => 'SPEController@deleteAllSPE']);
Route::post('/spe/multiUpload', ['as' =>'import_spe', 'uses' => 'SPEController@multiUploadSPE']);
Route::post('/spe/addNew', ['as' =>'add_new_SPE', 'uses' => 'SPEController@create']);
Route::post('/spe/{id}', ['as' =>'post_one_spe', 'uses' => 'SPEController@update']);
Route::post('/spe/{id}/AJAX', ['as' =>'edit_one_spe_AJAX', 'uses' => 'SPEController@updateAJAX']);
Route::get('/spe/{id}/update', ['as' =>'update_spe', 'uses' => 'SPEController@updateCoords']);

//SPE event
Route::get('spe/events/{id}/delete', ['as' =>'delete_one_spe_event', 'uses' => 'SPEController@deleteOneEvent']);


});