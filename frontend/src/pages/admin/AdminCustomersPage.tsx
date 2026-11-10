import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminService } from '../../services/adminService';

export default function AdminCustomersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const customers = useQuery({ queryKey: ['admin-customers', search], queryFn: () => adminService.customers({ search, per_page: 50 }) });
  const updateMut = useMutation({ mutationFn: ({ id, p }: any) => adminService.updateCustomer(id, p), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-customers'] }) });

  const list = (customers.data as any)?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="mb-4 px-3 py-2 border rounded" />
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Active</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.is_active ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  <button
                    onClick={() => updateMut.mutate({ id: c.id, p: { is_active: !c.is_active } })}
                    className="text-indigo-600"
                  >
                    {c.is_active ? 'Deactivate' : 'Activate'}
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
