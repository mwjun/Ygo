<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OTS extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'store';
    public $timestamps = false;

    protected $fillable = ['location', 
    						'address',
							'city',
							'state',
							'zip',
							'country',
							'phone',
							'email',
							'duel_terminal',
							'lat',
							'lng',
							'schedule',
							'type',
							'active',
							'featured',
							'featured_url',
							'remote_duel',
							'discord_invite'
							];

}
