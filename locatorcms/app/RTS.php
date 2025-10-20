<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RTS extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'regional';
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

		return $this->hasMany('\App\RTSEvent', 'id_regional');

	}
}


