<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RTSEvent extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'regional_event';
    public $timestamps = false;

    protected $fillable = [	'id_regional',
    					    'cap',
							'completed_results',
							'date',
							'dragon_duel',
						
							'time',
							];
}
