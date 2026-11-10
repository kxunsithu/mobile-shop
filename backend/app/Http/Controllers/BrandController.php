<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $query = Brand::where('is_active', true);
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        return response()->json($query->orderBy('name')->paginate($request->get('per_page', 15)));
    }

    public function show(Brand $brand)
    {
        return response()->json($brand);
    }
}
