import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminService.dashboard });

  if (isLoading) return <div>Loading...</div>;
  const d = data || {};

  const cards = [
    { label: 'Total Revenue', value: `$${Number(d.total_revenue || 0).toFixed(2)}` },
    { label: 'Total Orders', value: d.total_orders },
    { label: 'Customers', value: d.total_customers },
    { label: 'Products', value: d.total_products },
    { label: 'Pending Orders', value: d.pending_orders },
    { label: 'Low Stock', value: d.low_stock_products },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className="text-2xl font-bold mt-1">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Recent Orders</h2>
          <div className="space-y-2 text-sm">
            {(d.recent_orders || []).map((o: any) => (
              <div key={o.id} className="flex justify-between border-b pb-2">
                <span>{o.order_number}</span>
                <span>${Number(o.total).toFixed(2)}</span>
              </div>
            ))}
            {(!d.recent_orders || d.recent_orders.length === 0) && <p className="text-gray-500">No orders</p>}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Best Selling</h2>
          <div className="space-y-2 text-sm">
            {(d.best_selling || []).map((b: any, i: number) => (
              <div key={i} className="flex justify-between border-b pb-2">
                <span>{b.product_name}</span>
                <span>{b.total_sold}</span>
              </div>
            ))}
            {(!d.best_selling || d.best_selling.length === 0) && <p className="text-gray-500">No data</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
