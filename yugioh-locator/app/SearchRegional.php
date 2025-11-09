<?php
    namespace App;
    use Eloquent;
    use DB;
    
    class SearchRegional extends Eloquent {
        protected $table = 'regional';
        public $timestamps = false;

        public static function getRegionalLocationsByDistance($lat, $lng, $dist, $page, $date)
        {
// VOT!!!
            return SearchRegional::select('regional.id as id', 'location', 'address', 'address2', 'city', 'state', 'zip', 'phone', 'email', 'lat', 'lng', 
                 'regional_event.dragon_duel as dragon_duel', 
                                          'regional_event.date as date', 'regional_event.time as time', 'regional_event.cap as cap', 'regional_event.completed_results as completed_results',
                                          DB::raw("( 3959 * acos( cos( radians($lat) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat ) ) ) ) AS distance"))
                                ->join('regional_event', 'regional_event.id_regional', '=', 'regional.id')
                                ->having('distance', '<', $dist)
                                ->whereRaw($date)
                                ->take(20)->skip($page * 20)
                                ->orderBy('distance')
                                ->get();
        }

        public static function getRegionalLocationsCount($lat, $lng, $dist, $date)
        {
            return SearchRegional::select(DB::raw("( 3959 * acos( cos( radians($lat) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat ) ) ) ) AS distance"))
                                ->join('regional_event', 'regional_event.id_regional', '=', 'regional.id')
                                ->having('distance', '<', $dist)
                                ->whereRaw($date)
                                ->get()
                                ->count();
        }

        public static function getRegionalLocationsByState($country, $state)
        {
            return SearchRegional::select('location', 'host', 'address', 'address2', 'city', 'state', 'zip', 'phone', 'email', 'date', 'time', 'cap')
                                ->join('regional_event', 'regional_event.id_regional', '=', 'regional.id')
                                ->where('country', '=', $country)
                                ->where('state', '=', $state)
                                ->orderBy('date')
                                ->get();
        }

        public static function getRegionalLocationByID($id)
        {
            return SearchRegional::select('location', 'host', 'address', 'address2', 'city', 'state', 'zip', 'phone', 'email', 'date', 'time', 'cap')
                                ->join('regional_event', 'regional_event.id_regional', '=', 'regional.id')
                                ->where('regional.id', '=', $id)
                                ->orderBy('date')
                                ->get();
        }

    }

