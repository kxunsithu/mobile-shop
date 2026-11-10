<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminBrandController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Brand::withCount('products')->orderByDesc('created_at')->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        $brand = Brand::create($data);
        return response()->json($brand, 201);
    }

    public function show(Brand $brand)
    {
        return response()->json($brand);
    }

    public function update(Request $request, Brand $brand)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . $brand->id;
        }
        $brand->update($data);
        return response()->json($brand);
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
