<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'images', 'variants'])
            ->where('is_active', true);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%");
            });
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        if ($request->filled('ram')) {
            $query->whereHas('variants', fn($q) => $q->where('ram', $request->ram));
        }
        if ($request->filled('storage')) {
            $query->whereHas('variants', fn($q) => $q->where('storage', $request->storage));
        }

        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc'); break;
            case 'price_desc':
                $query->orderBy('price', 'desc'); break;
            case 'popular':
                $query->orderBy('views', 'desc'); break;
            default:
                $query->orderBy('created_at', 'desc'); break;
        }

        $perPage = (int) $request->get('per_page', 12);
        return response()->json($query->paginate($perPage));
    }

    public function show(Product $product)
    {
        $product->increment('views');
        $product->load(['category', 'brand', 'images', 'variants']);
        $related = Product::with(['images', 'variants'])
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->limit(8)->get();
        return response()->json([
            'product' => $product,
            'related' => $related,
        ]);
    }
}
