<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class CartController extends Controller
{
    protected function getCart(Request $request): Cart
    {
        return Cart::firstOrCreate(['user_id' => $request->user()->id]);
    }

    public function show(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->load(['items.product.images', 'items.variant']);
        return response()->json($cart);
    }

    public function addItem(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($data['product_id']);
        $variant = null;
        if (!empty($data['product_variant_id'])) {
            $variant = ProductVariant::findOrFail($data['product_variant_id']);
            if ($variant->product_id !== $product->id) {
                return response()->json(['message' => 'Variant mismatch'], 422);
            }
        }

        $stock = $variant ? $variant->stock : $product->stock;
        if ($data['quantity'] > $stock) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }

        $cart = $this->getCart($request);
        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->where('product_variant_id', $data['product_variant_id'] ?? null)
            ->first();

        if ($item) {
            $newQty = $item->quantity + $data['quantity'];
            if ($newQty > $stock) {
                return response()->json(['message' => 'Insufficient stock'], 422);
            }
            $item->update(['quantity' => $newQty]);
        } else {
            $item = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'product_variant_id' => $data['product_variant_id'] ?? null,
                'quantity' => $data['quantity'],
            ]);
        }

        $cart->load(['items.product.images', 'items.variant']);
        return response()->json($cart);
    }

    public function updateItem(Request $request, CartItem $item)
    {
        $cart = $this->getCart($request);
        if ($item->cart_id !== $cart->id) {
            abort(403);
        }
        $data = $request->validate(['quantity' => 'required|integer|min:1']);
        $product = $item->product;
        $variant = $item->variant;
        $stock = $variant ? $variant->stock : $product->stock;
        if ($data['quantity'] > $stock) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }
        $item->update(['quantity' => $data['quantity']]);
        $cart->load(['items.product.images', 'items.variant']);
        return response()->json($cart);
    }

    public function removeItem(Request $request, CartItem $item)
    {
        $cart = $this->getCart($request);
        if ($item->cart_id !== $cart->id) {
            abort(403);
        }
        $item->delete();
        $cart->load(['items.product.images', 'items.variant']);
        return response()->json($cart);
    }

    public function clear(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->items()->delete();
        $cart->load(['items.product.images', 'items.variant']);
        return response()->json($cart);
    }
}
