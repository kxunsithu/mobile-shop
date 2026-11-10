<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'images', 'variants']);
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }
        return response()->json($query->orderByDesc('created_at')->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|max:100',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'processor' => 'nullable|string|max:255',
            'display' => 'nullable|string|max:255',
            'camera' => 'nullable|string|max:255',
            'battery' => 'nullable|string|max:255',
            'os' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        $data['stock'] = $data['stock'] ?? 0;

        $product = Product::create($data);

        // variants
        $variants = $request->input('variants', []);
        if (is_string($variants)) {
            $variants = json_decode($variants, true) ?: [];
        }
        foreach ($variants as $v) {
            ProductVariant::create([
                'product_id' => $product->id,
                'color' => $v['color'] ?? null,
                'ram' => $v['ram'] ?? null,
                'storage' => $v['storage'] ?? null,
                'price' => $v['price'] ?? $product->price,
                'compare_price' => $v['compare_price'] ?? null,
                'stock' => $v['stock'] ?? 0,
                'sku' => $v['sku'] ?? null,
                'is_active' => $v['is_active'] ?? true,
            ]);
        }

        // images
        $this->handleImages($request, $product);

        $product->load(['category', 'brand', 'images', 'variants']);
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'brand', 'images', 'variants']);
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'specifications' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|max:100',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'processor' => 'nullable|string|max:255',
            'display' => 'nullable|string|max:255',
            'camera' => 'nullable|string|max:255',
            'battery' => 'nullable|string|max:255',
            'os' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . $product->id;
        }

        $product->update($data);

        // replace variants if provided
        if ($request->has('variants')) {
            $variants = $request->input('variants');
            if (is_string($variants)) {
                $variants = json_decode($variants, true) ?: [];
            }
            $product->variants()->delete();
            foreach ($variants as $v) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'color' => $v['color'] ?? null,
                    'ram' => $v['ram'] ?? null,
                    'storage' => $v['storage'] ?? null,
                    'price' => $v['price'] ?? $product->price,
                    'compare_price' => $v['compare_price'] ?? null,
                    'stock' => $v['stock'] ?? 0,
                    'sku' => $v['sku'] ?? null,
                    'is_active' => $v['is_active'] ?? true,
                ]);
            }
        }

        $this->handleImages($request, $product);

        $product->load(['category', 'brand', 'images', 'variants']);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }

    protected function handleImages(Request $request, Product $product): void
    {
        // file uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $idx => $file) {
                $path = $file->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => Storage::url($path),
                    'is_primary' => $product->images()->count() === 0 && $idx === 0,
                    'sort_order' => $product->images()->count(),
                ]);
            }
        }

        // string urls
        $imageUrls = $request->input('image_urls', []);
        if (is_string($imageUrls)) {
            $imageUrls = json_decode($imageUrls, true) ?: [];
        }
        foreach ($imageUrls as $idx => $url) {
            if (!is_string($url) || $url === '') continue;
            ProductImage::create([
                'product_id' => $product->id,
                'path' => $url,
                'is_primary' => $product->images()->count() === 0,
                'sort_order' => $product->images()->count(),
            ]);
        }
    }
}
