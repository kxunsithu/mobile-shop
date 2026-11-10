<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::where('is_active', true);
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        return response()->json($query->orderBy('name')->paginate($request->get('per_page', 15)));
    }

    public function show(Category $category)
    {
        return response()->json($category);
    }
}
