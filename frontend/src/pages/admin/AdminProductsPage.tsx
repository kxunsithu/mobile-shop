import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const products = useQuery({ queryKey: ['admin-products'], queryFn: () => productService.adminList({ per_page: 50 }) });
  const categories = useQuery({ queryKey: ['categories'], queryFn: () => categoryService.list({ per_page: 50 }) });
  const brands = useQuery({ queryKey: ['brands'], queryFn: () => brandService.list({ per_page: 50 }) });

  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ name: '', description: '', price: '', compare_price: '', stock: 0, category_id: '', brand_id: '', image_urls: '', variants: '' });

  const reset = () => { setEditing(null); setForm({ name: '', description: '', price: '', compare_price: '', stock: 0, category_id: '', brand_id: '', image_urls: '', variants: '' }); };

  const createMut = useMutation({ mutationFn: (p: any) => productService.create(p), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); reset(); } });
  const updateMut = useMutation({ mutationFn: ({ id, p }: any) => productService.update(id, p), onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); reset(); } });
  const deleteMut = useMutation({ mutationFn: (id: number) => productService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }) });

  const buildPayload = () => {
    const payload: any = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      stock: Number(form.stock),
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
    };
    if (form.image_urls) {
      try { payload.image_urls = JSON.parse(form.image_urls); } catch { payload.image_urls = form.image_urls.split(',').map((s: string) => s.trim()).filter(Boolean); }
    }
    if (form.variants) {
      try { payload.variants = JSON.parse(form.variants); } catch { payload.variants = []; }
    }
    return payload;
  };

  const submit = () => {
    const payload = buildPayload();
    if (editing) updateMut.mutate({ id: editing.id, p: payload });
    else createMut.mutate(payload);
  };

  const startEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || '', price: p.price, compare_price: p.compare_price || '',
      stock: p.stock, category_id: p.category_id || '', brand_id: p.brand_id || '',
      image_urls: '', variants: JSON.stringify(p.variants || []),
    });
  };

  const list = (products.data as any)?.data ?? [];
  const catList = (categories.data as any)?.data ?? categories.data ?? [];
  const brandList = (brands.data as any)?.data ?? brands.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <h2 className="font-semibold mb-3">{editing ? 'Edit Product' : 'New Product'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded" />
          <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="px-3 py-2 border rounded" />
          <input placeholder="Compare price" type="number" value={form.compare_price} onChange={e => setForm({ ...form, compare_price: e.target.value })} className="px-3 py-2 border rounded" />
          <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="px-3 py-2 border rounded" />
          <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="px-3 py-2 border rounded">
            <option value="">Category</option>
            {catList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={form.brand_id} onChange={e => setForm({ ...form, brand_id: e.target.value })} className="px-3 py-2 border rounded">
            <option value="">Brand</option>
            {brandList.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border rounded md:col-span-2" rows={2} />
          <input placeholder='Image URLs (comma or JSON array)' value={form.image_urls} onChange={e => setForm({ ...form, image_urls: e.target.value })} className="px-3 py-2 border rounded md:col-span-2" />
          <textarea placeholder='Variants JSON (array)' value={form.variants} onChange={e => setForm({ ...form, variants: e.target.value })} className="px-3 py-2 border rounded md:col-span-2" rows={3} />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={submit} className="bg-indigo-600 text-white px-4 py-2 rounded">{editing ? 'Update' : 'Create'}</button>
          {editing && <button onClick={reset} className="px-4 py-2 border rounded">Cancel</button>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">${Number(p.price).toFixed(2)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.category?.name}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => startEdit(p)} className="text-indigo-600">Edit</button>
                  <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(p.id); }} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
