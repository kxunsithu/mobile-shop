import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService, brandService } from '../services';
import ProductCard from '../components/common/ProductCard';
import Spinner from '../components/common/Spinner';
import { useState } from 'react';

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [categoryId, setCategoryId] = useState(params.get('category_id') || '');
  const [brandId, setBrandId] = useState(params.get('brand_id') || '');
  const [sort, setSort] = useState(params.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(params.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('max_price') || '');
  const [page, setPage] = useState(Number(params.get('page') || 1));

  const categories = useQuery({ queryKey: ['categories'], queryFn: () => categoryService.list({ per_page: 50 }) });
  const brands = useQuery({ queryKey: ['brands'], queryFn: () => brandService.list({ per_page: 50 }) });

  const queryParams: any = { per_page: 12, page, sort };
  if (search) queryParams.search = search;
  if (categoryId) queryParams.category_id = categoryId;
  if (brandId) queryParams.brand_id = brandId;
  if (minPrice) queryParams.min_price = minPrice;
  if (maxPrice) queryParams.max_price = maxPrice;

  const products = useQuery({ queryKey: ['products', queryParams], queryFn: () => productService.list(queryParams) });

  const data = products.data as any;
  const list = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;

  const apply = () => {
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (categoryId) p.set('category_id', categoryId);
    if (brandId) p.set('brand_id', brandId);
    if (sort) p.set('sort', sort);
    if (minPrice) p.set('min_price', minPrice);
    if (maxPrice) p.set('max_price', maxPrice);
    p.set('page', '1');
    setParams(p);
    setPage(1);
  };

  const catList = (categories.data as any)?.data ?? categories.data ?? [];
  const brandList = (brands.data as any)?.data ?? brands.data ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters */}
      <aside className="bg-white rounded-xl p-4 shadow-sm h-fit">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Search</label>
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="Product name" />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="">All</option>
              {catList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Brand</label>
            <select value={brandId} onChange={e => setBrandId(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="">All</option>
              {brandList.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Min</label>
              <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium">Max</label>
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Sort</label>
            <select value={sort} onChange={e => setSort(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Popular</option>
            </select>
          </div>
          <button onClick={apply} className="w-full bg-indigo-600 text-white py-2 rounded-md">Apply</button>
        </div>
      </aside>

      {/* Products */}
      <main className="md:col-span-3">
        {products.isLoading ? <Spinner /> : (
          <>
            {list.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No products found.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {list.map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
            {lastPage > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: lastPage }, (_, i) => i + 1).map(pn => (
                  <button key={pn} onClick={() => { setPage(pn); const sp = new URLSearchParams(params); sp.set('page', String(pn)); setParams(sp); }} className={`px-3 py-1 rounded ${pn === page ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>
                    {pn}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
