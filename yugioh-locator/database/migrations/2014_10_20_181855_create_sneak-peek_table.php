<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSneakPeekTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//
        Schema::create('sneak_peek', function($t)
        {
            $t->increments('id');
            $t->integer('id_store')->unsigned();
            $t->date('date');
            $t->time('time');
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
        Schema::drop('sneak_peek');
	}

}
