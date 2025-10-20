<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RTSController extends Controller
{
	public function index()
    {
        $regionals = \App\RTS::paginate(15);
        return view('pages.rts', ['regionals' => $regionals]);
    }

    public function getOrderBy($column) {

    	$stores = \App\RTS::orderBy($column)->paginate(15);
    	return view('pages.rts', compact('stores'));
    }

     public function getRegionals() {
     	if (!$value) {
     		return \App\RTS::orderBy($column)->get();
     	}

    	$stores = \App\RTS::where('location', 'LIKE', '%'.$value.'%')->get();
    	return $stores;
    }
    public function getAllRegionals() {

    	$stores = \App\RTS::all();
    	return $stores->toJson();
    }

    // Get One RTS for editing in modal window. AJAX
    public function show($id) {
		$rts = \App\RTS::with('events')->findOrFail($id);    	
		// $events = \App\RTS::events()->all();
    	return $rts;
    }

	// Delete Official Tournament store
    public function destroy($id) {
    	$rts = \App\RTS::findOrFail($id);
    	$rts->delete();
    	return redirect()->back();
    }

    public function updateAJAX($id) {
        
        $rts = \App\RTS::findOrFail($id);

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
                    if (\App\RTSEvent::find($event_id) != null) {
                        $rts_event = \App\RTSEvent::findOrFail($event_id);
                    } else {
                        $rts_event = new \App\RTSEvent;
                    }
                    // taking data from inputs array with same key 
                    $rts_event->id_regional = $rts->id;
                    $rts_event->time = $_POST['time'][$key];
                    $rts_event->date = $_POST['date'][$key];
                    $rts_event->cap = $_POST['capacity'][$key];
                    $rts_event->dragon_duel = $_POST['dragon_duel'][$key];
                    $rts_event->completed_results = $_POST['completed_results'][$key];
                    
                    $rts_event->save();
                }
            }



        return $rts;
    }
    // Save editing OTS
    public function update($id) {

		$validator = \Validator::make(\Input::all(), [
            'location' => 'required|max:100',
        ]);

    	if ($validator->fails()) {
    		return redirect()->back()->withErrors($validator);
    	} else {

		$rts = \App\RTS::findOrFail($id);
    	
    	

    		$rts->location = \Input::get('location');
    		$rts->host = \Input::get('host');
    		$rts->address = \Input::get('address');
    		$rts->address2 = \Input::get('address2');
			$rts->city  = \Input::get('city');
			$rts->state  = \Input::get('state');
			$rts->zip  = \Input::get('zip');
			$rts->country  = \Input::get('country');
			$rts->phone  = \Input::get('phone');
			$rts->email  = \Input::get('email');

			$rts->lat = \Input::get('lat');
			$rts->lng  = \Input::get('lng');

			$rts->save();

			if (\Input::get('event_id')) {
				// every row 	
	    		foreach (\Input::get('event_id') as $key => $event_id) {  			

	    			// looking for EVENT with id from EVENT_ID form
	    			if (\App\RTSEvent::find($event_id) != null) {
	    				$rts_event = \App\RTSEvent::findOrFail($event_id);
	    			} else {
	    				$rts_event = new \App\RTSEvent;
	    			}
	    			// taking data from inputs array with same key 
	    			$rts_event->id_regional = $rts->id;
	    			$rts_event->time = \Input::get('time')[$key];
	    			$rts_event->date = \Input::get('date')[$key];
	    			$rts_event->cap = \Input::get('capacity')[$key];
	    			$rts_event->dragon_duel = \Input::get('dragon_duel')[$key];
	    			$rts_event->completed_results = \Input::get('completed_results')[$key];
	    			
	    			$rts_event->save();
	    		}
    		}
    	}
    	return redirect()->back();
		
    }

    // Post new Regional
    public function store(Request $request) {
    	
    	
    	$validator = \Validator::make($request->all(), [
            'location' => 'required|max:100',
        ]);

    	if ($validator->fails()) {
    		return redirect ('/rts')->withErrors($validator)->withInput();
    	} else {
    		$rts = \App\RTS::create([
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
	    				$rts_event = \App\RTSEvent::findOrFail($event_id);
	    			} else {
	    				$rts_event = new \App\RTSEvent;
	    			}
	    			// taking data from inputs array with same key 
	    			$rts_event->id_regional = $rts->id;
	    			$rts_event->time = \Input::get('time')[$key];
	    			$rts_event->date = \Input::get('date')[$key];
	    			$rts_event->cap = \Input::get('capacity')[$key];
	    			$rts_event->dragon_duel = \Input::get('dragon_duel')[$key];
	    			$rts_event->completed_results = \Input::get('completed_results')[$key];
	    			
	    			$rts_event->save();
	    		}
    		}
    	}
    	return redirect()->back();
    }

    public function updateCoords($id) {
        //return $_GET;
        $rts = \App\RTS::findOrFail($id);
        $rts->lat = $_GET['lat'];
        $rts->lng = $_GET['lng'];
        $rts->save();
    }
    // MULTI UPLOAD
    public function multiUploadRTS() {
        $errors = array();
        $events = array();
        set_time_limit(600);

        $file = \Input::file('file')->path();

        if (mime_content_type($file) != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && mime_content_type($file) != 'application/vnd.ms-excel') {
            array_push($errors, 'WRONG FILE');
            return ["errors"=>$errors];
        }         

        // get first page of Excel document
        $reader = \Excel::load(\Input::file('file'))->get()[0];  	
        try { 
            //$file = json_decode(file_get_contents($new_url));
        } catch (\Exception $e) { 
            // if an exception happened in the try block above 
            // array_push($errors, $e->getMessage());
           array_push($errors, 'WRONG FILE');
            
        }

        try { 
            foreach ($reader as $sheet) {
                if ($sheet->venue || $sheet->address_line_1) {

                        
                        


                    // get coordinates by address
                    $url = "https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=" . $sheet->address_line_1 . ",+" . $sheet->city . ",+ " . $sheet->state_province . "&key=" . env('GOOGLE_API_KEY');
                    $new_url = str_replace(' ', '%20', $url);
                    // parse google maps api response
                    // $file = json_decode(file_get_contents($new_url));

                    $lat = (!empty($file->results[0])) ? $file->results[0]->geometry->location->lat : 0;
                    $lng = (!empty($file->results[0])) ? $file->results[0]->geometry->location->lng : 0;
                    $rts = \App\RTS::create([
                        'location' => $sheet->venue,
                        'host' => $sheet->event_host,
                        'address' => $sheet->address_line_1, 
                        'address2' => $sheet->address_line_2, 
                        'city' => $sheet->city,
                        'state' => $sheet->state_province,
                        'zip' => $sheet->zip_postal,
                        'country' => $sheet->country,
                        'phone' => $sheet->phone,
                        'email' => $sheet->e_mail_address,
                        
                        'lat' => $lat,
                        'lng' => $lng,
                    ]);

                    $dd = ($sheet->dragon_duel == 'Yes' || $sheet->dragon_duel == 'yes' || $sheet->dragon_duel == 1) ? 1 : 0;
                    $cr = ($sheet->results_announced == 'Yes' || $sheet->results_announced == 'yes' || $sheet->results_announced == 1) ? 1 : 0;

                    \App\RTSEvent::create([
                        'id_regional' => $rts->id,
                        'cap' => $sheet->venue_seating_capacity,
                        'date' => $sheet->date,
                        'time' => $sheet->time,
                        'completed_results' => $cr,
                        'dragon_duel' => $dd,
                    ]);
                    array_push($events, $rts);
                    unset($file);
                
                }

            }

        } catch (\Exception $e) { 
            // if an exception happened in the try block above 
            // array_push($errors, $e->getMessage());
            array_push($errors, "Incorrect fields");
            
        }
   
    	// });
        // return redirect()->back();
    	return  ["errors"=>$errors, "events"=>$events] ;
    }

    //delete one event
    public function deleteOneEvent($id) {
    	//$event = \App\RTSEvent::findOrFail($id);
    	//$event->delete();
		\App\RTSEvent::destroy($id);
    }

    public function deleteAllRTS() {

        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        \App\RTSEvent::truncate();
        \App\RTS::truncate();

        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        return redirect()->back();

    }

}
