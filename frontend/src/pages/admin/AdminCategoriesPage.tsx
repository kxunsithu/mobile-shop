import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { categoryService } from '../../services/categoryService';

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const cats = useQuery({ queryKey: ['admin-categories'], queryFn: () => categoryService.adminList({ per_page: 50 }) });
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [editing, setEditing] = useState<any>(null);

  const createMut = useMutation({ mutationFn: (p: any) => categoryService.create(p), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setForm({ name: '', description: '', image: '' }); } });
  const updateMut = useMutation({ mutationFn: ({ id, p }: any) => categoryService.update(id, p), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setEditing(null); setForm({ name: '', description: '', image: '' }); } });
  const deleteMut = useMutation({ mutationFn: (id: number) => categoryService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }) });

  const submit = () => {
    if (editing) updateMut.mutate({ id: editing.id, p: form });
    else createMut.mutate(form);
  };

  const list = (cats.data as any)?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex gap-2 flex-wrap">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded" />
        <input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="px-3 py-2 border rounded" />
        <button onClick={submit} className="bg-indigo-600 text-white px-4 py-2 rounded">{editing ? 'Update' : 'Create'}</button>
        {editing && <button onClick={() => { setEditing(null); setForm({ name: '', description: '', image: '' }); }} className="px-4 py-2 border rounded">Cancel</button>}
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Actions</th></tr></thead>
          <tbody>
            {list.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description || '', image: c.image || '' }); }} className="text-indigo-600">Edit</button>
                  <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(c.id); }} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
