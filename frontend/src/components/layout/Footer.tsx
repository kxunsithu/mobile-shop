export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">MobileShop</h3>
          <p className="text-sm">Your trusted mobile phone store.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>Phones</li>
            <li>Accessories</li>
            <li>Brands</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>Contact</li>
            <li>FAQ</li>
            <li>Shipping</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p className="text-sm">info@mobileshop.com</p>
          <p className="text-sm">+95 9 000 0000</p>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center text-xs py-4">
        © {new Date().getFullYear()} MobileShop. All rights reserved.
      </div>
    </footer>
  );
}
