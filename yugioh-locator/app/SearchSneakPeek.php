<?php
    namespace App;
    use Eloquent;
    use DB;
    
    class SearchSneakPeek extends Eloquent {
        protected $table = 'sneak_peek_new';
        public $timestamps = false;

        public static function getRegionalLocationsByDistance($lat, $lng, $dist, $page, $date)
        {
// VOT!!!

            return SearchSneakPeek::select('sneak_peek_new.id as id', 'location', 'address',  'city', 'state', 'zip', 'phone', 'email', 'lat', 'lng', 
                 /* 'sneak_peek_event.dragon_duel as dragon_duel', */
                                'sneak_peek_event_new.id as event_id',
                                        'sneak_peek_event_new.event_name as event_name',
                                          'sneak_peek_event_new.date as date', 'sneak_peek_event_new.time as time', /* 'sneak_peek.cap as cap', 'sneak_peek_event.completed_results as completed_results',*/
                                          DB::raw("( 3959 * acos( cos( radians($lat) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat ) ) ) ) AS distance"))
                                ->join('sneak_peek_event_new', 'sneak_peek_event_new.id_sneak_peek', '=', 'sneak_peek_new.id')
                                ->having('distance', '<', $dist)
                                /* ->whereRaw($date) */
                                ->take(20)->skip($page * 20)
                                ->orderBy('distance')
                                ->get();
/*
            return SearchSneakPeek::select('*')->get();
            
            return SearchSneakPeak::select('sneak_peek.id as id', 'location', 'address', 'address2', 'city', 'state', 'zip', 'phone', 'email', 'lat', 'lng', 
                 'sneak_peek_event.dragon_duel as dragon_duel', 
                                          'sneak_peek_event.date as date', 'sneak_peek_event.time as time', 'sneak_peek_event.cap as cap', 'sneak_peek_event.completed_results as completed_results',
                                          DB::raw("( 3959 * acos( cos( radians($lat) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat ) ) ) ) AS distance"))
                                ->join('sneak_peek_event', 'sneak_peek_event.id_sneak_peek', '=', 'sneak_peek.id')
                                ->having('distance', '<', $dist)
                                ->whereRaw($date)
                                ->take(20)->skip($page * 20)
                                ->orderBy('distance')
                                ->get();

                                */
                                
        }

        public static function getRegionalLocationsCount($lat, $lng, $dist, $date)
        {         

        return SearchSneakPeek::select(DB::raw("( 3959 * acos( cos( radians($lat) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat ) ) ) ) AS distance"))
                               
                                ->having('distance', '<', $dist)
                                /*->whereRaw($date) */
                                ->get()
                                ->count();  

            /*
            return SearchSneakPeak::select(DB::raw("( 3959 * acos( cos( radians($lat) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat ) ) ) ) AS distance"))
                                ->join('sneak_peek_event', 'sneak_peek_event.id_sneak_peek', '=', 'sneak_peek.id')
                                ->having('distance', '<', $dist)
                                ->whereRaw($date)
                                ->get()
                                ->count();
                                */
        }

        public static function getRegionalLocationsByState($country, $state)
        {
            return SearchSneakPeek::select('location', 'host', 'address', 'address2', 'city', 'state', 'zip', 'phone', 'email', 'date', 'time', 'cap')
                                ->join('sneak_peek_event', 'sneak_peek_event.id_sneak_peek', '=', 'sneak_peek_new.id')
                                ->where('country', '=', $country)
                                ->where('state', '=', $state)
                                ->orderBy('date')
                                ->get();
        }

        public static function getRegionalLocationByID($id)
        {
            return SearchSneakPeek::select('location', 'host', 'address', 'address2', 'city', 'state', 'zip', 'phone', 'email', 'date', 'time', 'cap')
                                ->join('sneak_peek_event', 'sneak_peek_event.id_sneak_peek', '=', 'sneak_peek_new.id')
                                ->where('sneak_peek_new.id', '=', $id)
                                ->orderBy('date')
                                ->get();
        }

    }

