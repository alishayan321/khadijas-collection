import { create } from "zustand";

export const useCart = create((set) => ({
  items: [],
  addItem: (item) =>
    set((s) => {
      const exists = s.items.find(
        (i) => i._id === item._id && i.size === item.size
      );
      if (exists) {
        return {
          items: s.items.map((i) =>
            i._id === item._id && i.size === item.size
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }
      return { items: [...s.items, { ...item, qty: 1 }] };
    }),
  removeItem: (id, size) =>
    set((s) => ({
      items: s.items.filter((i) => !(i._id === id && i.size === size)),
    })),
  updateQty: (id, size, qty) =>
    set((s) => ({
      items: s.items.map((i) =>
        i._id === id && i.size === size ? { ...i, qty } : i
      ),
    })),
  clear: () => set({ items: [] }),
}));