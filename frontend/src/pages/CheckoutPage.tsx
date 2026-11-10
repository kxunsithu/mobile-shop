import { useQuery, useMutation } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const addresses = useQuery({ queryKey: ['addresses'], queryFn: addressService.list });
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [reference, setReference] = useState('');
  const [newAddr, setNewAddr] = useState({
    full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'Myanmar',
  });
  const [useNew, setUseNew] = useState(false);

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => {
    const price = i.variant ? Number(i.variant.price) : Number(i.product?.price || 0);
    return s + price * i.quantity;
  }, 0);
  const deliveryFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + deliveryFee;

  const mutation = useMutation({
    mutationFn: (payload: any) => orderService.create(payload),
    onSuccess: (order: any) => {
      navigate(`/orders/${order.id}`);
    },
    onError: (e: any) => alert(e.response?.data?.message || 'Order failed'),
  });

  const submit = () => {
    const payload: any = { payment_method: paymentMethod };
    if (paymentMethod === 'bank_transfer' && reference) payload.reference = reference;
    if (useNew) {
      Object.assign(payload, newAddr);
    } else {
      if (!selectedAddress) { alert('Select an address'); return; }
      payload.address_id = selectedAddress;
    }
    mutation.mutate(payload);
  };

  if (!cart || items.length === 0) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center">Cart is empty. <a href="/products" className="text-indigo-600">Shop now</a></div>;
  }

  const addrList = addresses.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Delivery Address</h2>
          {addrList.length > 0 && !useNew && (
            <div className="space-y-2">
              {addrList.map((a: any) => (
                <label key={a.id} className="flex gap-2 items-start border rounded p-3 cursor-pointer">
                  <input type="radio" name="addr" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} />
                  <div className="text-sm">
                    <div className="font-medium">{a.full_name} - {a.phone}</div>
                    <div>{a.address_line1}, {a.city}</div>
                  </div>
                </label>
              ))}
              <button onClick={() => setUseNew(true)} className="text-indigo-600 text-sm mt-2">+ Use new address</button>
            </div>
          )}
          {(useNew || addrList.length === 0) && (
            <div className="grid grid-cols-1 gap-3 mt-2">
              <input placeholder="Full name" value={newAddr.full_name} onChange={e => setNewAddr({ ...newAddr, full_name: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Phone" value={newAddr.phone} onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Address line 1" value={newAddr.address_line1} onChange={e => setNewAddr({ ...newAddr, address_line1: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Address line 2" value={newAddr.address_line2} onChange={e => setNewAddr({ ...newAddr, address_line2: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="City" value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="State" value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="Postal code" value={newAddr.postal_code} onChange={e => setNewAddr({ ...newAddr, postal_code: e.target.value })} className="px-3 py-2 border rounded" />
              {addrList.length > 0 && <button onClick={() => setUseNew(false)} className="text-sm text-gray-500">Use saved address</button>}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Payment Method</h2>
          <label className="flex items-center gap-2 mb-2">
            <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} /> Bank Transfer
          </label>
          {paymentMethod === 'bank_transfer' && (
            <input placeholder="Payment reference" value={reference} onChange={e => setReference(e.target.value)} className="mt-3 w-full px-3 py-2 border rounded" />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm h-fit">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {items.map(i => {
          const price = i.variant ? Number(i.variant.price) : Number(i.product?.price || 0);
          return (
            <div key={i.id} className="flex justify-between text-sm mb-1">
              <span>{i.product?.name} x{i.quantity}</span>
              <span>${(price * i.quantity).toFixed(2)}</span>
            </div>
          );
        })}
        <div className="border-t mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <button onClick={submit} disabled={mutation.isPending} className="w-full mt-4 bg-indigo-600 text-white py-2.5 rounded-md font-semibold disabled:opacity-50">
          {mutation.isPending ? 'Placing...' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
}
