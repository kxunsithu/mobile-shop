<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function profile(Request $request)
    {
        $user = $request->user()->load('addresses', 'orders');
        return response()->json($user);
    }
}
