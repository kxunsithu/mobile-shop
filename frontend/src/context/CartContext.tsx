import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import type { Cart } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | undefined;
  count: number;
  isLoading: boolean;
  addItem: (payload: any) => Promise<void>;
  updateItem: (id: number, qty: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clear: () => Promise<void>;
  refetch: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: cart, isLoading, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.show,
    enabled: !!user,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['cart'] });

  const addItem = async (payload: any) => { await cartService.addItem(payload); await invalidate(); };
  const updateItem = async (id: number, qty: number) => { await cartService.updateItem(id, { quantity: qty }); await invalidate(); };
  const removeItem = async (id: number) => { await cartService.removeItem(id); await invalidate(); };
  const clear = async () => { await cartService.clear(); await invalidate(); };

  const count = cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, count, isLoading, addItem, updateItem, removeItem, clear, refetch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
