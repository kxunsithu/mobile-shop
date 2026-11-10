import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : err.response?.data?.message;
      setError(msg || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full px-3 py-2 border rounded" />
        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 border rounded" />
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2 border rounded" />
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full px-3 py-2 border rounded pr-10" />
          <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="relative">
          <input type={showConfirm ? 'text' : 'password'} required value={form.password_confirmation} onChange={e => setForm({ ...form, password_confirmation: e.target.value })} placeholder="Confirm password" className="w-full px-3 py-2 border rounded pr-10" />
          <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button className="w-full bg-indigo-600 text-white py-2.5 rounded font-semibold">Register</button>
      </form>
      <p className="mt-4 text-sm text-center">Have account? <Link to="/login" className="text-indigo-600">Login</Link></p>
    </div>
  );
}
