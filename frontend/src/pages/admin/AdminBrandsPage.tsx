import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { brandService } from '../../services/brandService';

export default function AdminBrandsPage() {
  const qc = useQueryClient();
  const brands = useQuery({ queryKey: ['admin-brands'], queryFn: () => brandService.adminList({ per_page: 50 }) });
  const [form, setForm] = useState({ name: '', description: '', logo: '' });
  const [editing, setEditing] = useState<any>(null);

  const createMut = useMutation({ mutationFn: (p: any) => brandService.create(p), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-brands'] }); setForm({ name: '', description: '', logo: '' }); } });
  const updateMut = useMutation({ mutationFn: ({ id, p }: any) => brandService.update(id, p), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-brands'] }); setEditing(null); setForm({ name: '', description: '', logo: '' }); } });
  const deleteMut = useMutation({ mutationFn: (id: number) => brandService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-brands'] }) });

  const submit = () => {
    if (editing) updateMut.mutate({ id: editing.id, p: form });
    else createMut.mutate(form);
  };

  const list = (brands.data as any)?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Brands</h1>
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex gap-2 flex-wrap">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded" />
        <input placeholder="Logo URL" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} className="px-3 py-2 border rounded" />
        <button onClick={submit} className="bg-indigo-600 text-white px-4 py-2 rounded">{editing ? 'Update' : 'Create'}</button>
        {editing && <button onClick={() => { setEditing(null); setForm({ name: '', description: '', logo: '' }); }} className="px-4 py-2 border rounded">Cancel</button>}
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Actions</th></tr></thead>
          <tbody>
            {list.map((b: any) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.name}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => { setEditing(b); setForm({ name: b.name, description: b.description || '', logo: b.logo || '' }); }} className="text-indigo-600">Edit</button>
                  <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(b.id); }} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
