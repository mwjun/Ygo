<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
class OTSController extends Controller
{


    public function showOts()
    {
        //$stores = \App\OTS::paginate(15);
        // return view('pages.ots'/*, ['stores' => $stores]*/);

        $allstores = \App\OTS::all();

        return $allstores;
    }

    public function getOrderBy($column) {

    	$stores = \App\OTS::orderBy($column)->paginate(15);
    	return view('pages.ots', compact('stores'));
    }

    public function index() {
    
        
        
        return view('pages.ots'/*, ['stores' => $stores]*/);
    }

    // Post new store
    public function addNewOTS(Request $request) {
    	
    	
    	$validator = \Validator::make($request->all(), [
            'location' => 'required|max:100',
        ]);

    	if ($validator->fails()) {
    		return redirect ('/ots')->withErrors($validator)->withInput();
    	} else {
    		\App\OTS::create([
    			'location' => $request->location,
    			'address' => $request->address, 
    			'city' => $request->city,
    			'state' => $request->state,
    			'zip' => $request->zip,
    			'country' => $request->country,
    			'phone' => $request->phone,
    			'email' => $request->email,
    			'duel_terminal' => ($request->duel_terminal == 1) ? 1 : NULL,
    			'lat' => $request->lat,
    			'lng' => $request->lng,
    			'schedule' => $request->schedule,
    			'type' => $request->type,
    			'active' => $request->active,
                'featured' => $request->featured,
                'featured_url' => $request->featured_url,
                'remote_duel' => $request->remote_duel,
    		]);
    	}
    	return redirect()->back();
    }

    // Get One OTS for editing in modal window. AJAX
    public function getOneOTS($id) {
		$ots = \App\OTS::findOrFail($id);    	
    	return $ots;
    }

    // Save editing OTS
    public function editOneOTS($id) {
		
		$validator = \Validator::make(\Input::all(), [
            'location' => 'required|max:100',
        ]);

    	if ($validator->fails()) {
    		return redirect()->back()->withErrors($validator);
    	} else {
    		$ots = \App\OTS::findOrFail($id);
    		$ots->location = \Input::get('location');
    		$ots->address = \Input::get('address');
			$ots->city  = \Input::get('city');
			$ots->state  = \Input::get('state');
			$ots->zip  = \Input::get('zip');
			$ots->country  = \Input::get('country');
			$ots->phone  = \Input::get('phone');
			$ots->email  = \Input::get('email');
			$ots->duel_terminal  = (\Input::get('duel_terminal') == 1) ? 1 : NULL;
			$ots->lat = \Input::get('lat');
			$ots->lng  = \Input::get('lng');
			$ots->schedule  = \Input::get('schedule');
			$ots->type  = \Input::get('type');
			$ots->active = \Input::get('active');
            $ots->featured = \Input::get('featured');
            $ots->featured_url = \Input::get('featured_url');
            $ots->remote_duel = \Input::get('remote_duel');
            $ots->discord_invite = \Input::get('discord_invite');
            
    		$ots->save();
    	}
    	return redirect()->back();
		
    }

    // MULTY UPLOAD
    public function multiUploadOTS() {

        Excel::load(\Input::file('file')->getPathname(), function($reader) {

    // reader methods
    $reader->each(function($sheet) {

                $active = (   $sheet->active == 'yes' || 
                         $sheet->active == 'Yes' || 
                         $sheet->active == 'True' || 
                         $sheet->active == '1') ? 1 : NULL;
                \App\OTS::create([
                    'location' => $sheet->company_name_for_web,
                    'address' => $sheet->store_address, 
                    'city' => $sheet->city,
                    'state' => $sheet->state,
                    'zip' => $sheet->zip_code,
                    'country' => $sheet->country,
                    'phone' => $sheet->store_phone,
                    'email' => $sheet->store_main_email,

                    'lat' => $sheet->lattitude,
                    'lng' => $sheet->longitude,
                    'schedule' => $sheet->tournament_schedule,
                    'type' => '',
                    

                    'active' => 1,


                    'featured' => $sheet->featured_ots,
                    'featured_url' => $sheet->featured_url,
                    'remote_duel' => $sheet->remote_duel,
                    
                    'discord_invite' => $sheet->discord_invite,
                ]);
    });
});

    	return redirect()->back();
    }

    // Delete Official Tournament store
    public function deleteOTS($id) {
    	$ots = \App\OTS::findOrFail($id);
    	$ots->delete();
    	return redirect()->back();
    }

    public function deleteAllOTS() {
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        \App\OTS::truncate();

        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        return redirect()->back();

    }



    /**
     * API
     *
     * @return all ots
     */
	public function APIindex()
    {
  
        $stores = \App\OTS::all();
        
        return ($stores);
    }
    
}
