<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStoreTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//
        Schema::create('store', function($t)
        {
            $t->increments('id');
            $t->string('location', 255);
            $t->string('address', 255);
            $t->string('city', 255);
            $t->string('state', 255);
            $t->string('zip', 255);
            $t->string('country', 255);
            $t->string('phone', 255); 
            $t->string('email', 255);
            $t->boolean('duel_terminal');
            $t->float('lat');
            $t->float('lng');
            $t->text('schedule');
            $t->text('type');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
        Schema::drop('store');
	}

}
