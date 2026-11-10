import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => orderService.list({ per_page: 20 }) });
  const list = (data as any)?.data ?? [];

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {list.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((o: any) => (
            <Link key={o.id} to={`/orders/${o.id}`} className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{o.order_number}</div>
                  <div className="text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${Number(o.total).toFixed(2)}</div>
                  <div className="text-xs">
                    <span className="px-2 py-0.5 rounded bg-gray-100">{o.status}</span>
                    <span className="ml-1 px-2 py-0.5 rounded bg-gray-100">{o.payment_status}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
