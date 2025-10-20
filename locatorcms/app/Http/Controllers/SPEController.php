<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SPEController extends Controller
{
    public function view() {

        $sneakpeeks = \App\SPE::all();
        return $sneakpeeks->toJson();
    	// $sneakpeeks = \App\SPE::all();
    	
    }

    public function index() {
        return view('pages.spe');        
    }

    public function getOneSPE($id) {

    	$sneakpeek = \App\SPE::with('events')->findOrFail($id);    
    	return $sneakpeek;
    }

    public function deleteSPE($id) {
    	$rts = \App\SPE::findOrFail($id);
    	$rts->delete();
    	return redirect()->back();
    }

    public function updateAJAX($id) {
        
        $rts = \App\SPE::findOrFail($id);

        $rts->location =$_POST['location'];
        $rts->host = $_POST['host'];
        $rts->address = $_POST['address'];
        $rts->address2 = $_POST['address2'];
        $rts->city  = $_POST['city'];
        $rts->state  = $_POST['state'];
        $rts->zip  = $_POST['zip'];
        $rts->country  = $_POST['country'];
        $rts->phone  = $_POST['phone'];
        $rts->email  = $_POST['email'];

        $rts->lat = $_POST['lat'];
        $rts->lng  = $_POST['lng'];

        $rts->save();

            if (isset($_POST['event_id'])) {
                // every row    
                foreach ($_POST['event_id'] as $key => $event_id) {            

                    // looking for EVENT with id from EVENT_ID form
                    if (\App\SPEEvent::find($event_id) != null) {
                        $rts_event = \App\SPEEvent::findOrFail($event_id);
                    } else {
                        $rts_event = new \App\SPEEvent;
                    }
                    // taking data from inputs array with same key 
                    $rts_event->id_sneak_peek = $rts->id;
                    $rts_event->event_name = $_POST['event_name'][$key];
                    $rts_event->date = $_POST['date'][$key];
                    $rts_event->time = $_POST['time'][$key];
                    // $rts_event->cap = $_POST['capacity'][$key];
                    // $rts_event->dragon_duel = $_POST['dragon_duel'][$key];
                    // $rts_event->completed_results = $_POST['completed_results'][$key];
                    
                    $rts_event->save();
                }
            }



        return $rts;
    }

    public function update($id) {

    	
	
		$validator = \Validator::make(\Input::all(), [
            'location' => 'required|max:100',
        ]);

    	if ($validator->fails()) {
    		return redirect()->back()->withErrors($validator);
    	} else {

		$sneakpeek = \App\SPE::findOrFail($id);
    	
    	

    		$sneakpeek->location = \Input::get('location');
    		$sneakpeek->host = \Input::get('host');
    		$sneakpeek->address = \Input::get('address');
    		$sneakpeek->address2 = \Input::get('address2');
			$sneakpeek->city  = \Input::get('city');
			$sneakpeek->state  = \Input::get('state');
			$sneakpeek->zip  = \Input::get('zip');
			$sneakpeek->country  = \Input::get('country');
			$sneakpeek->phone  = \Input::get('phone');
			$sneakpeek->email  = \Input::get('email');
			// $rts->duel_terminal  = \Input::get('duel_terminal');
			$sneakpeek->lat = \Input::get('lat');
			$sneakpeek->lng  = \Input::get('lng');
			// $rts->schedule  = \Input::get('schedule');
			// $rts->type  = \Input::get('type');
			// $rts->active = \Input::get('active');
			$sneakpeek->save();

			if (\Input::get('event_id') != null) {
    			// every row 	
        		foreach (\Input::get('event_id') as $key => $event_id) {
        			

        			// looking for EVENT with id from EVENT_ID form
        			if (\App\SPEEvent::find($event_id)) {

        				$sneakpeek_event = \App\SPEEvent::findOrFail($event_id);
        			} else {
        				$sneakpeek_event = new \App\SPEEvent;
        			}
        			// taking data from inputs array with same key 
        			$sneakpeek_event->id_sneak_peek = $sneakpeek->id;
        			$sneakpeek_event->time = \Input::get('time')[$key];
        			$sneakpeek_event->date = \Input::get('date')[$key];
        			$sneakpeek_event->cap = \Input::get('capacity')[$key];
        			$sneakpeek_event->dragon_duel = \Input::get('dragon_duel')[$key];
        			$sneakpeek_event->completed_results = \Input::get('completed_results')[$key];
        			
        			$sneakpeek_event->save();
        		}
            }
    	}
    	return redirect()->back();

    }

   // Post new Regional
    public function create(Request $request) {
    	
    	
    	$validator = \Validator::make($request->all(), [
            'location' => 'required|max:100',
            'host' => 'required|max:100',
        ]);

    	if ($validator->fails()) {
    		return redirect()->back()->withErrors($validator)->withInput($request->all());
    	} else {
    		$spe = \App\SPE::create([
    			'location' => $request->location,
    			'host' => $request->host,
    			'address' => $request->address, 
    			'address2' => $request->address2, 
    			'city' => $request->city,
    			'state' => $request->state,
    			'zip' => $request->zip,
    			'country' => $request->country,
    			'phone' => $request->phone,
    			'email' => $request->email,
    			'lat' => $request->lat,
    			'lng' => $request->lng,
    		]);

    		// every row 	
    		if (\Input::get('event_id') != null) {
	    		foreach (\Input::get('event_id') as $key => $event_id) {
	    			

	    			// looking for EVENT with id from EVENT_ID form
	    			if (\App\RTSEvent::find($event_id)) {
	    				$spe_event = \App\SPEEvent::findOrFail($event_id);
	    			} else {
	    				$spe_event = new \App\SPEEvent;
	    			}
	    			// taking data from inputs array with same key 
	    			$spe_event->id_sneak_peek = $spe->id;
                    $spe_event->event_name = \Input::get('event_name')[$key];
                    
	    			$spe_event->time = \Input::get('time')[$key];
	    			$spe_event->date = \Input::get('date')[$key];
	    			// $spe_event->cap = \Input::get('capacity')[$key];
	    			// $spe_event->dragon_duel = \Input::get('dragon_duel')[$key];
	    			// $spe_event->completed_results = \Input::get('completed_results')[$key];
	    			
	    			$spe_event->save();
	    		}
    		}
    	}
    	return redirect()->back();
    }

    public function updateCoords($id) {
        //return $_GET;
        $spe = \App\SPE::findOrFail($id);
        $spe->lat = $_GET['lat'];
        $spe->lng = $_GET['lng'];
        $spe->save();
        // return $spe;
    }
// MULTY UPLOAD
    public function multiUploadSPE() {

        $errors = array();
        $events = array();
                   
        set_time_limit(600);

        $file = \Input::file('file')->path();

        if (mime_content_type($file) != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && mime_content_type($file) != 'application/vnd.ms-excel') {
            array_push($errors, 'WRONG FILE');
            return ["errors"=>$errors];
        }  

        $reader = \Excel::load(\Input::file('file'))->get();     
        
        try { 
            foreach ($reader as $sheet) {
             
        	
                    if ($sheet->organizationname || $sheet->shiptoaddress) {
            			// $duel = ( 	$sheet->duel_terminal == 'yes' || 
            			// 			$sheet->duel_terminal == 'Yes' || 
            			// 			$sheet->duel_terminal == '1') ? 1 : 0;

        				$url = "https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=" . $sheet->shiptoaddress . ",+" . $sheet->shiptocity . ",+ " . $sheet->shiptosate;
        				$new_url = str_replace(' ', '%20', $url);


                        try { 
                            // $file = json_decode(file_get_contents($new_url));
                        } catch (\Exception $e) { 
                            // if an exception happened in the try block above 
                            // array_push($errors, $e->getMessage());
                            array_push($errors, $sheet->organizationname . ' @ ' . $sheet->shiptoaddress);
                            
                        }
        				
            
                        // if (!empty($file)) {

                            $lat = (!empty($file->results[0])) ? $file->results[0]->geometry->location->lat : 0;
                            $lng = (!empty($file->results[0])) ? $file->results[0]->geometry->location->lng : 0;
                			$spe = \App\SPE::create([
                				'location' => $sheet->organizationname,
                				'host' => $sheet->organizationname,
                				'address' => $sheet->shiptoaddress, 
                				'city' => $sheet->shiptocity,
                				'state' => $sheet->shiptosate,
                				'zip' => $sheet->shiptozip,
                				'country' => $sheet->shiptocountry,
                				'phone' => $sheet->shiptophone,
                				'email' => $sheet->shiptoemail,
                				
                				'lat' => $lat,
                				'lng' => $lng,
                			]);

                            \App\SPEEvent::create([
                                'id_sneak_peek' => $spe->id,
                                'event_name' => $sheet->event_name,
                                // 'schedule' => $sheet->schedule,
                                // 'cap' => $sheet->venue_seating_capacity,
                                'date' => $sheet->date,
                                'time' => $sheet->time,
                                // 'completed_results' => $cr,
                                // 'dragon_duel' => $dd,
                            ]);


                            array_push($events, $spe);
                            unset($file); 
                        // }
                    }
                    
        	
                }
            } catch (\Exception $e) { 
            // if an exception happened in the try block above 
            array_push($errors, "Incorrect fields");            
        }
        
        // return redirect()->back();
    	return ["errors"=>$errors, "events"=>$events] ;
    }

    public function deleteOneEvent($id) {
        //$event = \App\RTSEvent::findOrFail($id);
        //$event->delete();
        \App\SPEEvent::destroy($id);
    }


    public function deleteAllSPE() {
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        \App\SPEEvent::truncate();
        \App\SPE::truncate();

        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        return redirect()->back();

    }
}
