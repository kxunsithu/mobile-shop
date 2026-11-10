import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminService } from '../../services/adminService';

export default function AdminInventoryPage() {
  const qc = useQueryClient();
  const inv = useQuery({ queryKey: ['admin-inventory'], queryFn: () => adminService.inventory({ per_page: 50 }) });
  const [stocks, setStocks] = useState<Record<number, number>>({});
  const updateMut = useMutation({ mutationFn: ({ id, p }: any) => adminService.updateInventory(id, p), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-inventory'] }) });

  const list = (inv.data as any)?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 flex gap-2">
                  <input
                    type="number"
                    defaultValue={p.stock}
                    onChange={e => setStocks({ ...stocks, [p.id]: Number(e.target.value) })}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => updateMut.mutate({ id: p.id, p: { stock: stocks[p.id] ?? p.stock } })}
                    className="text-indigo-600"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
