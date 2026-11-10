import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { addressService } from '../services/addressService';
import { authService } from '../services/authService';
import { useState } from 'react';
import { Eye } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const addresses = useQuery({ queryKey: ['addresses'], queryFn: addressService.list });
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [pw, setPw] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [showPw, setShowPw] = useState(false);
  const [addrForm, setAddrForm] = useState({ full_name: '', phone: '', address_line1: '', city: '', country: 'Myanmar' });

  const updateProfile = useMutation({ mutationFn: () => authService.updateProfile({ name, phone }), onSuccess: () => alert('Updated') });
  const changePw = useMutation({ mutationFn: () => authService.changePassword(pw), onSuccess: () => { alert('Password changed'); setPw({ current_password: '', password: '', password_confirmation: '' }); }, onError: (e: any) => alert(e.response?.data?.message || 'Failed') });
  const createAddr = useMutation({ mutationFn: () => addressService.create(addrForm), onSuccess: () => { qc.invalidateQueries({ queryKey: ['addresses'] }); setAddrForm({ full_name: '', phone: '', address_line1: '', city: '', country: 'Myanmar' }); } });
  const deleteAddr = useMutation({ mutationFn: (id: number) => addressService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }) });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">Profile</h2>
        <div className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" />
          <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Phone" />
          <button onClick={() => updateProfile.mutate()} className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">Change Password</h2>
        <div className="space-y-3">
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} placeholder="Current password" value={pw.current_password} onChange={e => setPw({ ...pw, current_password: e.target.value })} className="w-full px-3 py-2 border rounded pr-10" />
            <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"><Eye size={18} /></button>
          </div>
          <input type={showPw ? 'text' : 'password'} placeholder="New password" value={pw.password} onChange={e => setPw({ ...pw, password: e.target.value })} className="w-full px-3 py-2 border rounded" />
          <input type={showPw ? 'text' : 'password'} placeholder="Confirm" value={pw.password_confirmation} onChange={e => setPw({ ...pw, password_confirmation: e.target.value })} className="w-full px-3 py-2 border rounded" />
          <button onClick={() => changePw.mutate()} className="bg-indigo-600 text-white px-4 py-2 rounded">Change</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">Addresses</h2>
        <div className="space-y-2 mb-4">
          {(addresses.data || []).map((a: any) => (
            <div key={a.id} className="border rounded p-3 flex justify-between items-center">
              <div className="text-sm">
                <div className="font-medium">{a.full_name} ({a.phone})</div>
                <div>{a.address_line1}, {a.city}</div>
              </div>
              <button onClick={() => deleteAddr.mutate(a.id)} className="text-red-600 text-sm">Delete</button>
            </div>
          ))}
        </div>
        <h3 className="font-medium mb-2">Add Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input placeholder="Full name" value={addrForm.full_name} onChange={e => setAddrForm({ ...addrForm, full_name: e.target.value })} className="px-3 py-2 border rounded" />
          <input placeholder="Phone" value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })} className="px-3 py-2 border rounded" />
          <input placeholder="Address line 1" value={addrForm.address_line1} onChange={e => setAddrForm({ ...addrForm, address_line1: e.target.value })} className="px-3 py-2 border rounded md:col-span-2" />
          <input placeholder="City" value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} className="px-3 py-2 border rounded" />
          <button onClick={() => createAddr.mutate()} className="bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
        </div>
      </div>
    </div>
  );
}
