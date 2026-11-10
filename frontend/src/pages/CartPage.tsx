import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Spinner from '../components/common/Spinner';

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart();

  if (isLoading) return <Spinner />;
  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => {
    const price = i.variant ? Number(i.variant.price) : Number(i.product?.price || 0);
    return s + price * i.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-indigo-600">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {items.map(item => {
          const price = item.variant ? Number(item.variant.price) : Number(item.product?.price || 0);
          const img = item.product?.images?.find(i => i.is_primary)?.path || item.product?.images?.[0]?.path;
          return (
            <div key={item.id} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
              <img src={img || 'https://placehold.co/100'} alt="" className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{item.product?.name}</h3>
                {item.variant && <p className="text-xs text-gray-500">{[item.variant.color, item.variant.ram, item.variant.storage].filter(Boolean).join(' / ')}</p>}
                <p className="text-indigo-600 font-semibold">${price.toFixed(2)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateItem(item.id, Math.max(1, Number(e.target.value)))}
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <button onClick={() => removeItem(item.id)} className="text-red-600 text-sm">Remove</button>
                </div>
              </div>
              <div className="font-semibold">${(price * item.quantity).toFixed(2)}</div>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm h-fit">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between mb-4"><span>Delivery</span><span>Calculated at checkout</span></div>
        <div className="flex justify-between font-bold border-t pt-3"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
        <Link to="/checkout" className="block mt-4 bg-indigo-600 text-white text-center py-2.5 rounded-md font-semibold">Proceed to Checkout</Link>
        <Link to="/products" className="block mt-2 text-center text-indigo-600 text-sm">Continue shopping</Link>
      </div>
    </div>
  );
}
