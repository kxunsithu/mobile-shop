<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::updateOrCreate(['email' => 'admin@example.com'], [
            'name' => 'Admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Customer demo
        User::updateOrCreate(['email' => 'customer@example.com'], [
            'name' => 'Demo Customer',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_active' => true,
        ]);

        $categories = ['Smartphones', 'Accessories', 'Tablets'];
        $catModels = [];
        foreach ($categories as $c) {
            $catModels[$c] = Category::firstOrCreate(['slug' => Str::slug($c)], [
                'name' => $c,
                'is_active' => true,
            ]);
        }

        $brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo'];
        $brandModels = [];
        foreach ($brands as $b) {
            $brandModels[$b] = Brand::firstOrCreate(['slug' => Str::slug($b)], [
                'name' => $b,
                'is_active' => true,
            ]);
        }

        $phones = [
            ['name' => 'iPhone 15 Pro', 'brand' => 'Apple', 'cat' => 'Smartphones', 'price' => 1299.00, 'stock' => 20],
            ['name' => 'Samsung Galaxy S24', 'brand' => 'Samsung', 'cat' => 'Smartphones', 'price' => 999.00, 'stock' => 15],
            ['name' => 'Xiaomi 14', 'brand' => 'Xiaomi', 'cat' => 'Smartphones', 'price' => 699.00, 'stock' => 30],
            ['name' => 'Oppo Find X7', 'brand' => 'Oppo', 'cat' => 'Smartphones', 'price' => 799.00, 'stock' => 12],
            ['name' => 'Vivo X100', 'brand' => 'Vivo', 'cat' => 'Smartphones', 'price' => 749.00, 'stock' => 18],
        ];

        foreach ($phones as $p) {
            $product = Product::firstOrCreate(['slug' => Str::slug($p['name'])], [
                'name' => $p['name'],
                'description' => $p['name'] . ' is a great phone.',
                'price' => $p['price'],
                'compare_price' => $p['price'] + 100,
                'stock' => $p['stock'],
                'category_id' => $catModels[$p['cat']]->id,
                'brand_id' => $brandModels[$p['brand']]->id,
                'is_active' => true,
                'is_featured' => true,
            ]);
            // image placeholder
            ProductImage::firstOrCreate(['product_id' => $product->id, 'path' => 'https://placehold.co/600x600?text=' . urlencode($p['name'])], [
                'is_primary' => true,
                'sort_order' => 0,
            ]);
            // variants
            if ($product->variants()->count() === 0) {
                foreach ([['8GB', '128GB'], ['8GB', '256GB'], ['12GB', '256GB']] as $i => $v) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'ram' => $v[0],
                        'storage' => $v[1],
                        'color' => 'Black',
                        'price' => $p['price'] + ($i * 50),
                        'stock' => 10,
                        'is_active' => true,
                    ]);
                }
            }
        }

        // accessory
        $acc = Product::firstOrCreate(['slug' => 'usb-c-cable'], [
            'name' => 'USB-C Cable',
            'description' => 'Fast charging cable',
            'price' => 9.99,
            'stock' => 100,
            'category_id' => $catModels['Accessories']->id,
            'is_active' => true,
        ]);
        ProductImage::firstOrCreate(['product_id' => $acc->id, 'path' => 'https://placehold.co/600x600?text=USB-C+Cable'], [
            'is_primary' => true,
        ]);
    }
}
