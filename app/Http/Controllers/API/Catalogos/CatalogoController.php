<?php

namespace App\Http\Controllers\API\Catalogos;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CatalogoController extends Controller
{
    public function index()
    {
        return User::all();
    }
}
