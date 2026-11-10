import { Link } from 'react-router-dom';
import type { Product } from '../../types';

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.find(i => i.is_primary)?.path || product.images?.[0]?.path || 'https://placehold.co/400x400?text=No+Image';
  const price = Number(product.price);
  const compare = product.compare_price ? Number(product.compare_price) : null;
  return (
    <Link to={`/products/${product.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img src={img} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="mt-3 flex-1">
        <p className="text-xs text-gray-500">{product.brand?.name}</p>
        <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-indigo-600 font-bold">${price.toFixed(2)}</span>
          {compare && compare > price && <span className="text-gray-400 line-through text-sm">${compare.toFixed(2)}</span>}
        </div>
        <p className={`text-xs mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? 'In stock' : 'Out of stock'}
        </p>
      </div>
    </Link>
  );
}
