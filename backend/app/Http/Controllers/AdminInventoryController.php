<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class AdminInventoryController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('variants')
            ->orderBy('stock')
            ->paginate($request->get('per_page', 15));
        return response()->json($products);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'stock' => 'sometimes|integer|min:0',
            'variants' => 'sometimes|array',
        ]);
        if (isset($data['stock'])) {
            $product->update(['stock' => $data['stock']]);
        }
        if (isset($data['variants'])) {
            foreach ($data['variants'] as $v) {
                if (isset($v['id'])) {
                    ProductVariant::where('id', $v['id'])->where('product_id', $product->id)
                        ->update(['stock' => $v['stock'] ?? 0]);
                }
            }
        }
        $product->load('variants');
        return response()->json($product);
    }
}
