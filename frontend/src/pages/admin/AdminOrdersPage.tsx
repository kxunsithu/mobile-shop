import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { orderService } from '../../services/orderService';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('');
  const orders = useQuery({ queryKey: ['admin-orders', status], queryFn: () => orderService.adminList({ status: status || undefined, per_page: 50 }) });
  const updateMut = useMutation({ mutationFn: ({ id, p }: any) => orderService.adminUpdate(id, p), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }) });

  const list = (orders.data as any)?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="mb-4">
        <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 border rounded">
          <option value="">All statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Order #</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o: any) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.order_number}</td>
                <td className="p-3">{o.user?.name}</td>
                <td className="p-3">${Number(o.total).toFixed(2)}</td>
                <td className="p-3">
                  <select value={o.status} onChange={e => updateMut.mutate({ id: o.id, p: { status: e.target.value } })} className="px-2 py-1 border rounded">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <select value={o.payment_status} onChange={e => updateMut.mutate({ id: o.id, p: { payment_status: e.target.value } })} className="px-2 py-1 border rounded">
                    <option value="unpaid">unpaid</option>
                    <option value="paid">paid</option>
                    <option value="refunded">refunded</option>
                  </select>
                </td>
                <td className="p-3">
                  <a href={`/orders/${o.id}`} className="text-indigo-600">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
