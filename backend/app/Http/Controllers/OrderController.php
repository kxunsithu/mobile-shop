<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with(['items', 'address', 'payments'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 15));
        return response()->json($orders);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }
        $order->load(['items.product', 'items.variant', 'address', 'payments']);
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'address_id' => 'nullable|exists:addresses,id',
            'full_name' => 'required_without:address_id|string|max:255',
            'phone' => 'required_without:address_id|string|max:30',
            'address_line1' => 'required_without:address_id|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required_without:address_id|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'payment_method' => 'required|in:cod,bank_transfer',
            'notes' => 'nullable|string',
            'reference' => 'nullable|string|max:255',
        ]);

        $user = $request->user();
        $cart = Cart::with(['items.product', 'items.variant'])->where('user_id', $user->id)->first();
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        if (!empty($data['address_id'])) {
            $address = Address::where('id', $data['address_id'])->where('user_id', $user->id)->firstOrFail();
        } else {
            $address = Address::create([
                'user_id' => $user->id,
                'full_name' => $data['full_name'],
                'phone' => $data['phone'],
                'address_line1' => $data['address_line1'],
                'address_line2' => $data['address_line2'] ?? null,
                'city' => $data['city'],
                'state' => $data['state'] ?? null,
                'postal_code' => $data['postal_code'] ?? null,
                'country' => $data['country'] ?? 'Myanmar',
            ]);
        }

        try {
            $order = DB::transaction(function () use ($user, $cart, $address, $data) {
                $subtotal = 0;
                foreach ($cart->items as $ci) {
                    $price = $ci->variant ? $ci->variant->price : $ci->product->price;
                    $stock = $ci->variant ? $ci->variant->stock : $ci->product->stock;
                    if ($ci->quantity > $stock) {
                        throw new \RuntimeException('Insufficient stock for ' . $ci->product->name);
                    }
                    $subtotal += (float) $price * $ci->quantity;
                }

                $deliveryFee = $subtotal >= 50000 ? 0 : 3000;
                $total = $subtotal + $deliveryFee;

                $order = Order::create([
                    'order_number' => 'ORD-' . strtoupper(uniqid()),
                    'user_id' => $user->id,
                    'address_id' => $address->id,
                    'subtotal' => $subtotal,
                    'delivery_fee' => $deliveryFee,
                    'total' => $total,
                    'status' => 'pending',
                    'payment_method' => $data['payment_method'],
                    'payment_status' => 'unpaid',
                    'notes' => $data['notes'] ?? null,
                ]);

                foreach ($cart->items as $ci) {
                    $product = $ci->product;
                    $variant = $ci->variant;
                    $price = $variant ? $variant->price : $product->price;
                    $variantInfo = null;
                    if ($variant) {
                        $parts = array_filter([$variant->color, $variant->ram, $variant->storage]);
                        $variantInfo = implode(' / ', $parts);
                    }
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_variant_id' => $variant?->id,
                        'product_name' => $product->name,
                        'variant_info' => $variantInfo,
                        'price' => $price,
                        'quantity' => $ci->quantity,
                        'total' => (float) $price * $ci->quantity,
                    ]);

                    if ($variant) {
                        $variant->decrement('stock', $ci->quantity);
                    } else {
                        $product->decrement('stock', $ci->quantity);
                    }
                }

                Payment::create([
                    'order_id' => $order->id,
                    'method' => $data['payment_method'],
                    'amount' => $total,
                    'status' => 'pending',
                    'reference' => $data['reference'] ?? null,
                ]);

                $cart->items()->delete();

                return $order;
            });
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        $order->load(['items', 'address', 'payments']);
        return response()->json($order, 201);
    }

    public function cancel(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }
        if (!in_array($order->status, ['pending', 'confirmed'], true)) {
            return response()->json(['message' => 'Cannot cancel this order'], 422);
        }
        $order->update(['status' => 'cancelled', 'cancelled_at' => now()]);
        foreach ($order->items as $item) {
            if ($item->product_variant_id) {
                \App\Models\ProductVariant::where('id', $item->product_variant_id)->increment('stock', $item->quantity);
            } elseif ($item->product_id) {
                \App\Models\Product::where('id', $item->product_id)->increment('stock', $item->quantity);
            }
        }
        return response()->json($order);
    }
}
