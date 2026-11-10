import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/products?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-indigo-600">MobileShop</Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search phones..."
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </form>

        <div className="flex items-center gap-3 ml-auto">
          <Link to="/cart" className="relative p-2">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin" className="text-sm px-3 py-1.5 bg-gray-900 text-white rounded-md">Admin</Link>
              )}
              <Link to="/profile" className="p-2"><User size={20} /></Link>
              <button onClick={logout} className="p-2 text-gray-600"><LogOut size={20} /></button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm px-3 py-1.5 border rounded-md">Login</Link>
              <Link to="/register" className="text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md">Register</Link>
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <form onSubmit={handleSearch} className="flex">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="flex-1 px-3 py-2 border rounded-l-md" />
            <button className="px-3 bg-indigo-600 text-white rounded-r-md">Go</button>
          </form>
          {user ? (
            <>
              <Link to="/profile" className="block py-2" onClick={() => setOpen(false)}>Profile</Link>
              {isAdmin && <Link to="/admin" className="block py-2" onClick={() => setOpen(false)}>Admin</Link>}
              <button onClick={() => { logout(); setOpen(false); }} className="block py-2 text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
