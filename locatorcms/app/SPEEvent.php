<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SPEEvent extends Model
{
        /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'sneak_peek_event_new';
    public $timestamps = false;

    protected $fillable = [	'id_sneak_peek',
    					    'cap',
							'completed_results',
							'date',
							'dragon_duel',
							
                            'time',
                            'schedule',
							'event_name',
							];
}
