import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';

export default function OrderDetailPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const qc = useQueryClient();
  const { data: order, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => orderService.get(orderId) });
  const cancelMut = useMutation({ mutationFn: () => orderService.cancel(orderId), onSuccess: () => qc.invalidateQueries({ queryKey: ['order', id] }) });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8">Not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-indigo-600 text-sm">← Back</Link>
      <h1 className="text-2xl font-bold mt-2">{order.order_number}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-2">Status</h3>
          <p>Status: <span className="font-medium">{order.status}</span></p>
          <p>Payment: <span className="font-medium">{order.payment_status}</span> ({order.payment_method})</p>
          <p className="text-sm text-gray-500 mt-2">Placed: {new Date(order.created_at || Date.now()).toLocaleString()}</p>
          {['pending', 'confirmed'].includes(order.status) && (
            <button onClick={() => { if (confirm('Cancel order?')) cancelMut.mutate(); }} className="mt-3 text-red-600 text-sm">Cancel Order</button>
          )}
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-2">Delivery</h3>
          {order.address && (
            <div className="text-sm">
              <div>{order.address.full_name} - {order.address.phone}</div>
              <div>{order.address.address_line1}</div>
              <div>{order.address.city}, {order.address.country}</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mt-6">
        <h3 className="font-semibold mb-3">Items</h3>
        <div className="space-y-2">
          {order.items.map((it: any) => (
            <div key={it.id} className="flex justify-between text-sm border-b pb-2">
              <div>
                <div className="font-medium">{it.product_name}</div>
                {it.variant_info && <div className="text-gray-500 text-xs">{it.variant_info}</div>}
                <div className="text-gray-500 text-xs">x{it.quantity} @ ${Number(it.price).toFixed(2)}</div>
              </div>
              <div className="font-semibold">${Number(it.total).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>${Number(order.delivery_fee).toFixed(2)}</span></div>
          <div className="flex justify-between font-bold"><span>Total</span><span>${Number(order.total).toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
