import { useQuery } from '@tanstack/react-query';
import { productService, categoryService, brandService } from '../services';
import ProductCard from '../components/common/ProductCard';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const products = useQuery({ queryKey: ['products', 'featured'], queryFn: () => productService.list({ per_page: 8, sort: 'newest' }) });
  const categories = useQuery({ queryKey: ['categories'], queryFn: () => categoryService.list({ per_page: 20 }) });
  const brands = useQuery({ queryKey: ['brands'], queryFn: () => brandService.list({ per_page: 20 }) });

  const productList = (products.data as any)?.data ?? products.data ?? [];
  const catList = (categories.data as any)?.data ?? categories.data ?? [];
  const brandList = (brands.data as any)?.data ?? brands.data ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold">Find Your Perfect Phone</h1>
          <p className="mt-4 text-lg opacity-90 max-w-xl">Shop the latest smartphones and accessories at unbeatable prices.</p>
          <Link to="/products" className="inline-block mt-6 bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold">Shop Now</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {catList.map((c: any) => (
            <Link key={c.id} to={`/products?category_id=${c.id}`} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md">
              <div className="font-semibold">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-indigo-600">View all</Link>
        </div>
        {products.isLoading ? <div className="text-center py-8">Loading...</div> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productList.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Brands */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Popular Brands</h2>
        <div className="flex flex-wrap gap-3">
          {brandList.map((b: any) => (
            <Link key={b.id} to={`/products?brand_id=${b.id}`} className="bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md text-sm font-medium">
              {b.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
