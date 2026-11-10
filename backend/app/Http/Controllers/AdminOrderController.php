<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items', 'address', 'payments']);
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('order_number', 'like', "%{$s}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"));
            });
        }
        return response()->json($query->orderByDesc('created_at')->paginate($request->get('per_page', 15)));
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product', 'items.variant', 'address', 'payments']);
        return response()->json($order);
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'sometimes|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|in:unpaid,paid,refunded',
            'delivery_fee' => 'sometimes|numeric|min:0',
            'notes' => 'nullable|string',
        ]);
        if (isset($data['status']) && $data['status'] === 'cancelled' && $order->status !== 'cancelled') {
            foreach ($order->items as $item) {
                if ($item->product_variant_id) {
                    \App\Models\ProductVariant::where('id', $item->product_variant_id)->increment('stock', $item->quantity);
                } elseif ($item->product_id) {
                    \App\Models\Product::where('id', $item->product_id)->increment('stock', $item->quantity);
                }
            }
            $data['cancelled_at'] = now();
        }
        $order->update($data);
        return response()->json($order->fresh(['user', 'items', 'address', 'payments']));
    }

    public function cancel(Order $order)
    {
        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Already cancelled'], 422);
        }
        if (!in_array($order->status, ['pending', 'confirmed'], true)) {
            return response()->json(['message' => 'Cannot cancel'], 422);
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
