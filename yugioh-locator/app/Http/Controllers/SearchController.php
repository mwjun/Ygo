<?php

namespace App\Http\Controllers;

use Request;
use App\SearchStore;
use App\SearchRegional;
use App\SearchRegionalEvent;
use App\SearchSneakPeek;
use View;


class SearchController extends BaseController
{

    // search page
    public function getPage()
    {
        return \View::make('pages.search');
    }

    // store page
    public function getSingleStoreResultPage()
    {
        $id = Request::get('id');
        $search_type = Request::get('stype');
        $search_query = Request::get('squery');

        // OFFICIAL TOURNAMENT STORE 
        if ($search_type == 'ots') {
            $location = SearchStore::find($id);
        }
        // REGIONAL TOURNAMENT SEARCH
        else if ($search_type == 'rts') {
            $location = SearchRegional::find($id);
            $location['schedule'] = $this->formatRegionalScheduleView($id);
        }
        // SNEAK PEEK EVENT
        else if ($search_type == 'spe') {
            $location = SearchSneakPeek::find($id);
            $location['schedule'] = $this->formatSneakPeekScheduleView($id);
        }
        // ERROR - this is an invalid option
        else {
            return Redirect::to('/');
        }

        // Check here to see if queried location exists
        if ($location != 'null')
            return View::make('pages.store')->with('location', $location)->with('squery', $search_query);
        else
            return Redirect::to('/');
    }

    /** 
     * Search for locations based on distance is queried here
     * Function takes the query string values: radius, lat, lng, options, page
     * and makes an Ajax call to /result - the lat and lng are obtained through API call before the ajax call is made
     **/
    public function getSearchResults()
    {
        $search_type = Request::get('type');
        $rad = Request::get('radius');
        $lat = Request::get('lat');
        $lng = Request::get('lng');
        $options = Request::get('options');
        $page = Request::get('page');

        // Determine which type of search the user is requesting, and call up appropriate model depending on search
        // OFFICIAL TOURNAMENT STORE search
        if ($search_type == 'ots') {
            $count = SearchStore::getStoreLocationsCount($lat, $lng, $rad, $options);
            $result = SearchStore::getStoreLocationByDistance($lat, $lng, $rad, $options, $page);

            return (array('count' => $count, 'result' => $result));
        }
        // REGIONAL TOURNAMENT SEARCH
        else if ($search_type == 'rts') {
            $date_start = Request::get('sdate');
            $date_end = Request::get('edate');
            $date = $this->formatDateQuery($date_start, $date_end, $options);

            $count = SearchRegional::getRegionalLocationsCount($lat, $lng, $rad, $date);
            $result = SearchRegional::getRegionalLocationsByDistance($lat, $lng, $rad, $page, $date);

            return (array('count' => $count, 'result' => $result));
        }
        // SNEAK PEEK EVENT
        else if ($search_type == 'spe') {
            // JUST FOR TEST
            $date_start = Request::get('sdate');
            $date_end = Request::get('edate');
            $date = $this->formatDateQuery($date_start, $date_end, $options);

            $count = SearchSneakPeek::getRegionalLocationsCount($lat, $lng, $rad, $date);
            $result = SearchSneakPeek::getRegionalLocationsByDistance($lat, $lng, $rad, $page, $date);

            // $count = SearchRegional::getRegionalLocationsCount($lat, $lng, $rad, $date);
            //$result = SearchRegional::getRegionalLocationsByDistance($lat, $lng, $rad, $page, $date);


            return (array('count' => $count, 'result' => $result));

            // JUST FOR TEST


        }
        // ERROR - this is an invalid search - can default to OTS search in this situation.
        else {
            return Redirect::to('/');
        }
    }


    public function getSearchByNameResults()
    {
        $search_type = Request::get('type');
        $options = Request::get('options');
        $page = Request::get('page');
        $name = Request::get('name');
        // OFFICIAL TOURNAMENT STORE search
        if ($search_type == 'ots') {
            $result = SearchStore::getStoreLocationsByName($name, $options, $page);
            $count = count($result);
            return (array('count' => $count, 'result' => $result));
        }
    }

    /**
     * Format date for use in query of locations by region
     * @param date $date_start, date $date_end, bool $options
     **/
    private function formatDateQuery($date_start, $date_end, $options)
    {
        $today = date('Y-m-d');

        if ($options == 'true') {
            $date = "1=1";      //
        } else {
            if ($date_start && !($date_end)) {
                $date = "date >= '$date_start'";
            } else if ($date_start && $date_end) {
                $date = "date >= '$date_start' AND date < '$date_end'";
            } else if (!$date_start && $date_end) {
                $date = "date <= '$date_end'";
            } else {
                $date = "date > '$today'";
            }
        }

        return $date;
    }

    private function formatRegionalScheduleView($id)
    {
        $events = SearchRegionalEvent::select('date', 'time', 'cap')->where('id_regional', '=', $id)->get();
        $schedule = '';
        foreach ($events as $event) {
            $schedule .= $event->date . ' @ ' . $event->time;
            $schedule .= ($event->cap) ? ' (max capacity: ' . $event->cap . ')<br>' : '';
        }
        return $schedule;
    }


    private function formatSneakPeekScheduleView($id)
    {

        //$events = DB::select('date', 'time', 'cap')->where('id_regional', '=', $id)->get();
        $events = DB::table('sneak_peek_event_new')->where('id_sneak_peek', '=', $id)->orderBy('date', 'ASC')->get();

        $schedule = '';


        foreach ($events as $event) {
            $schedule .= '<span style="color:#4BCBBE">' . $event->event_name . '</span>' . '<br>';

            if ($event->date && $event->time) {
                $schedule .= $event->date . ' @ ' . $event->time . '<br>';
            } else {
                $schedule .= "Please contact store for schedule" .  '<br>';;
            }
            //$schedule .= ($event->cap) ? ' (max capacity: ' . $event->cap . ')<br>' : '';
        }


        return $schedule;
    }
}
