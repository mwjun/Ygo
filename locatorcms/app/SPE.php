<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SPE extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'sneak_peek_new';
    public $timestamps = false;

    protected $fillable = [	'address',
							'address2',
							'city',
							'country',
							'email',
							'host',
							'lat',
							'lng',
							'location',
							'phone',
							'state',
							'zip',
							];

	public function events() {

		return $this->hasMany('\App\SPEEvent', 'id_sneak_peek');

	}
}
