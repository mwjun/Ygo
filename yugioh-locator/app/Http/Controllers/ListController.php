<?php

class ListController extends BaseController {

    // get the locations list page
	public function getPage()
	{
        $countries = SearchStore::select('country')->groupBy('country')->get();
        $states = SearchStore::select('state')->groupBy('state')->where('country', '=', 'United States')->get();
		return View::make('pages.list')->with('countries', $countries)->with('states', $states)->with('ptype', 'list');
	}

    // get all countries depending on search type
    public function getCountries()
    {
        $search_type = Input::get('stype');
        // Official Tournament Store
        if ($search_type == 'ots') {
            $countries = SearchStore::select('country')->groupBy('country')->get();
        }
        // Regional Qualifier Location
        else if ($search_type == 'rts') {
            $countries =  SearchRegional::select('country')->groupBy('country')->get();
        }
        // ERROR - invalid search type
        else {
            return Redirect::to('/');
        }

        return View::make('pages.listcountry')->with('countries', $countries);
    }

    // getall states depending on search type and country selected
    public function getStatesFromCountry()
    {
        $search_type = Input::get('stype');
        $country = Input::get('scountry');
        // Official Tournament Store
        if ($search_type == 'ots') {
            $states = SearchStore::select('state')->groupBy('state')->where('country', '=', $country)->get();
        }
        // Regional Qualifier Location
        else if ($search_type == 'rts') {
            $states = SearchRegional::select('state')->groupBy('state')->where('country', '=', $country)->get();
        }
        // ERROR
        else {
            return Redirect::to('/');
        }

        return View::make('pages.liststate')->with('states', $states);
    }

    public function getLocationsTable()
    {
        $search_type = Input::get('stype');
        $country = Input::get('country');
        $state = Input::get('state');
        // Official Tournament Store
        if ($search_type == 'ots') {
            $locs = SearchStore::getStoreLocationsByState($country, $state);
        }
        // Regional Qualifier Location
        else if ($search_type == 'rts') {
            $locs = SearchRegional::getRegionalLocationsByState($country, $state);
        }
        // ERROR
        else {
            return Redirect::to('/');
        }

        return View::make('pages.listlocation')->with('locations', $locs)->with('stype', $search_type);
    }
}
