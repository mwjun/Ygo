<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ExcelController extends Controller
{
    public function postImportOTS() {
    	\Excel::load(\Input::file('file'), function($reader) {
    		dd($reader->get()[0]->venue);
    		$reader->each(function($sheet) {
    			dd($sheet);
    		});
    	});
    }



}
