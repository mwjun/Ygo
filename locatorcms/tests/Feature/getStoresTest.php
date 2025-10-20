<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class getStoresTest extends TestCase
{
    /** @test     */
    public function get_all_stores()
    {
    	$user = new \App\User(array('name' => 'admin', 'password' => '123456'));
		$this->be($user); //You are now authenticated

        $response = $this->call('GET', '/');
        $this->assertTrue(strpos($response->getContent(), 'ots') !== false);
    }

    /** @test     */
    public function get_json_stores() {
    	$response = $this->json('GET', '/api/ots');
    	
		$this->assertEquals(200, $response->status());
    }

 /** @test     */
    public function testNewUserRegistration()
	{
    // $this->visit('/ots')
    //      ->type('Taylor', 'location')
         
    //      ->press('Save changes')
    //      ->seePageIs('/dashboard');
	}

   /** @test */
    public function it_saves_a_model()
    {
        $this
        ->post('/ots/addNewOTS', [
               'location' => '$request->location',
    			'address' => '$request->address',
    			'city' => '$request->city',
    			'state' => '$request->state',
    			'zip' => '$request->zip',
    			'country' => '$request->country',
    			'phone' => '$request->phone',
    			'email' => '$request->email',
    			'duel_terminal' => '$request->duel_terminal',
    			'lat' => '$request->lat',
    			'lng' => '$request->lng',
    			'schedule' => '$request->schedule',
    			'type' => '$request->type',
    			'active' => '$request->active',
    			'created_at' => '$request->active',
            ]);
       //  $this->seeInDatabase('store', [
       //          'location' => '$request->location',
    			// 'address' => '$request->address',
    			// 'city' => '$request->city',
    			// 'state' => '$request->state',
    			// 'zip' => '$request->zip',
    			// 'country' => '$request->country',
    			// 'phone' => '$request->phone',
    			// 'email' => '$request->email',
    			// 'duel_terminal' => '$request->duel_terminal',
    			// 'lat' => '$request->lat',
    			// 'lng' => '$request->lng',
    			// 'schedule' => '$request->schedule',
    			// 'type' => '$request->type',
    			// 'active' => '$request->active',
       //      ]);
        // or
        $latest_record = \App\OTS::where('location', '=', '$request->location1');
        // assert everything equals what you want
    }   


}

