<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = (float) Order::where('status', '!=', 'cancelled')->sum('total');
        $totalOrders = Order::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalProducts = Product::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $lowStock = Product::where('stock', '<=', 5)->count();

        $recentOrders = Order::with('user')->orderByDesc('created_at')->limit(10)->get();

        $bestSelling = DB::table('order_items')
            ->select('product_name', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // sales overview last 7 days
        $sales = Order::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as revenue'), DB::raw('COUNT(*) as orders'))
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->where('status', '!=', 'cancelled')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_orders' => $totalOrders,
            'total_customers' => $totalCustomers,
            'total_products' => $totalProducts,
            'pending_orders' => $pendingOrders,
            'low_stock_products' => $lowStock,
            'recent_orders' => $recentOrders,
            'best_selling' => $bestSelling,
            'sales_overview' => $sales,
        ]);
    }
}
