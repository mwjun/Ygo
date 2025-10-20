<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRegionalEventTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//
        Schema::create('regional_event', function($t)
        {
            $t->increments('id');
            $t->integer('id_regional')->unsigned();
            $t->date('date');
            $t->time('time');
            $t->boolean('completed_results');
            $t->integer('cap')->unsigned();
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
        Schema::drop('regional_event');
	}

}
