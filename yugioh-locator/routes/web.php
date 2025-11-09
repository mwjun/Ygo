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

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', array('as' => 'search', 'uses' => 'SearchController@getPage'));

Route::get('/result', array('as' => 'result', 'uses' => 'SearchController@getSearchResults'));

Route::get('/resultByName', array('as' => 'resultByName', 'uses' => 'SearchController@getSearchByNameResults'));

Route::get('/store', array('as' => 'store', 'uses' => 'SearchController@getSingleStoreResultPage'));

Route::get('/list', array('as' => 'list', 'uses' => 'ListController@getPage'));

Route::get('/countrylist', array('as' => 'countrylist', 'uses' => 'ListController@getCountries'));

Route::get('/statelist', array('as' => 'statelist', 'uses' => 'ListController@getStatesFromCountry'));

Route::get('/locationlist', array('as' => 'locationlist', 'uses' => 'ListController@getLocationsTable'));