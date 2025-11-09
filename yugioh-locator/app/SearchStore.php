<?php
    namespace App;
    use Eloquent;
    use DB;
    
    class SearchStore extends Eloquent {
        protected $table = 'store';
        public $timestamps = false;
        
        public static function getStoreLocationByDistance($lat, $lng, $dist, $options, $page)
        {
            $options = ($options == 'true') ? 'AND remote_duel = 1' : '';
            return SearchStore::select('id', 'location', 'address', 'city', 'state', 'zip', 'phone', 'email', 'duel_terminal', 'active', 'schedule', 'lat', 'lng', 'featured', 'featured_url', 'remote_duel', 'discord_invite',
                                        DB::raw("( 3959 * acos( cos( radians($lat) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat ) ) ) ) AS distance"))
                                ->having('distance', '<', $dist)
                                ->whereRaw("active = 1 $options")
                                ->take(20)->skip($page * 20)
                                ->orderBy('distance')
                                ->get();
        }

        public static function getStoreLocationsByName($name, $options, $page) {
            return SearchStore::select('id', 'location', 'address', 'city', 'state', 'zip', 'phone', 'email', 'duel_terminal', 'active', 'schedule', 'lat', 'lng', 'featured', 'featured_url', 'remote_duel', 'discord_invite')
                    ->where('location', 'LIKE', '%' . $name . '%')
                    ->get();
        }

        public static function getStoreLocationsCount($lat, $lng, $dist, $options)
        {
            $options = ($options == 'true') ? 'AND duel_terminal IS NOT NULL' : '';
            return SearchStore::select(DB::raw("( 3959 * acos( cos( radians($lat) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians($lng) ) + sin( radians($lat) ) * sin( radians( lat ) ) ) ) AS distance")) 
                                ->having('distance', '<', $dist)
                                ->whereRaw("active = 1 $options")
                                ->get()
                                ->count();
        }

        public static function getStoreLocationsByState($country, $state)
        {
            return SearchStore::select('location', 'address', 'city', 'state', 'zip', 'phone', 'email', 'duel_terminal', 'schedule', 'active')
                                ->where('country', '=', $country)
                                ->where('state', '=', $state)
                                ->where('active', '=', 1)
                                ->orderBy('city')
                                ->get();
        }
    }
