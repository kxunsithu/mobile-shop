import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['product', id], queryFn: () => productService.get(id!) });
  const { addItem } = useCart();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  if (isLoading) return <Spinner />;
  const res = data as any;
  const product = res?.product ?? res;
  const related = res?.related ?? [];
  if (!product) return <div className="p-8">Not found</div>;

  const images = product.images || [];
  const variants = product.variants || [];
  const activeVariant = variants.find((v: any) => v.id === selectedVariant) || null;
  const price = activeVariant ? Number(activeVariant.price) : Number(product.price);
  const stock = activeVariant ? activeVariant.stock : product.stock;

  const handleAdd = async () => {
    if (!user) { window.location.href = '/login'; return; }
    try {
      await addItem({
        product_id: product.id,
        product_variant_id: selectedVariant,
        quantity: qty,
      });
      alert('Added to cart');
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img src={images[imgIdx]?.path || 'https://placehold.co/600x600?text=No+Image'} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((im: any, i: number) => (
                <button key={im.id} onClick={() => setImgIdx(i)} className={`w-16 h-16 rounded border overflow-hidden ${i === imgIdx ? 'border-indigo-600' : 'border-gray-200'}`}>
                  <img src={im.path} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-500">{product.brand?.name}</p>
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-indigo-600">${price.toFixed(2)}</span>
            {product.compare_price && Number(product.compare_price) > price && (
              <span className="text-gray-400 line-through">${Number(product.compare_price).toFixed(2)}</span>
            )}
          </div>
          <p className={`mt-2 text-sm ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </p>

          {variants.length > 0 && (
            <div className="mt-6">
              <p className="font-medium mb-2">Variants</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v: any) => {
                  const label = [v.color, v.ram, v.storage].filter(Boolean).join(' / ');
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`px-3 py-1.5 border rounded-md text-sm ${selectedVariant === v.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-300'}`}
                    >
                      {label} - ${Number(v.price).toFixed(2)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={stock || 1}
              value={qty}
              onChange={e => setQty(Math.max(1, Number(e.target.value)))}
              className="w-20 px-3 py-2 border rounded-md"
            />
            <button
              onClick={handleAdd}
              disabled={stock <= 0}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-md font-semibold disabled:bg-gray-300"
            >
              Add to Cart
            </button>
          </div>

          {product.description && (
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {(product.processor || product.display || product.camera || product.battery || product.os) && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Specifications</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {product.processor && <li><strong>Processor:</strong> {product.processor}</li>}
                {product.display && <li><strong>Display:</strong> {product.display}</li>}
                {product.camera && <li><strong>Camera:</strong> {product.camera}</li>}
                {product.battery && <li><strong>Battery:</strong> {product.battery}</li>}
                {product.os && <li><strong>OS:</strong> {product.os}</li>}
              </ul>
              {product.specifications && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{product.specifications}</p>}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
