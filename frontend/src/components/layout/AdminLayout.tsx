import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, Tag, ShoppingCart, Users, Boxes, ArrowLeft } from 'lucide-react';

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/brands', label: 'Brands', icon: Tag },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-60 bg-gray-900 text-gray-200 p-4 hidden md:block">
        <div className="text-white font-bold text-lg mb-6">Admin</div>
        <nav className="space-y-1">
          {items.map(it => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800'}`}
            >
              <it.icon size={18} /> {it.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="mt-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={16} /> Back to site
        </Link>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
