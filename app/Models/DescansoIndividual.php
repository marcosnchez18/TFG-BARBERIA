<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DescansoIndividual extends Model
{
    use HasFactory;


    protected $fillable = ['user_id', 'fecha'];

    protected $table = 'descansos_individuales';


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
