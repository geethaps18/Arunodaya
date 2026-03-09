"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { toast } from "react-hot-toast";
import { offers } from "@/data/offers";
// -------------------
// Types
// -------------------
export interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  availableSizes?: string[];
  mrp?: number;
subCategory?: string;
subSubSubCategory?: string;   // 🔥 ADD THIS
}
export interface BagItem {
  id: string;
  product: Product;
  images: string[];
  size?: string | null;
  color?: string | null;
  variantId?: string | null;

  price: number;          // 🔥 ADD THIS
  stock: number; 
  quantity: number;
  uniqueKey: string;
}


interface BagContextType {
  bagItems: BagItem[];
  totalCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  isSyncing: boolean;
  
addToCart: (
  product: Product,
  price: number,      // ✅ ADD THIS
  size?: string,
  color?: string,
  variantId?: string,
  images?: string[],
  stock?: number  
) => Promise<void>;


  removeFromCart: (uniqueKey: string) => Promise<void>;
  updateQuantity: (uniqueKey: string, quantity: number) => Promise<void>;
  updateSize: (uniqueKey: string, size: string) => Promise<void>;
  moveToWishlist: (uniqueKey: string) => Promise<void>;
  refreshBag: () => Promise<void>;
  setBagItems: (items: BagItem[]) => void;
   clearCart: () => Promise<void>;
}

// -------------------
// Context setup
// -------------------
const BagContext = createContext<BagContextType | undefined>(undefined);

// ✅ Hook to use context
export const useCart = (): BagContextType => {
  const context = useContext(BagContext);
  if (!context) throw new Error("useCart must be used within BagProvider");
  return context;
};

// -------------------
// Provider
// -------------------
interface BagProviderProps {
  children: ReactNode;
}

export const BagProvider = ({ children }: BagProviderProps) => {
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
const [isSyncing, setIsSyncing] = useState(false);

  // -------------------
  // Fetch bag from backend
  // -------------------
  const fetchBag = useCallback(async () => {
    try {
      const res = await fetch("/api/bag", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch bag");
      const data = await res.json();

      const itemsWithKey: BagItem[] = (data.items || []).map((item: any) => ({
        ...item,
        uniqueKey: `${item.product.id}-${item.size || "nosize"}-${item.color || "nocolor"}`,

      }));

      setBagItems(itemsWithKey);
    } catch (err) {
      console.error("Fetch bag error:", err);
      setBagItems([]);
    }
  }, []);

  useEffect(() => {
    fetchBag();
  }, [fetchBag]);

  // -------------------
  // Actions
  // -------------------
const addToCart = async (
  product: Product,
  price: number,
  size?: string,
  color?: string,
  variantId?: string,
  images: string[] = [],
  stock: number = Infinity
) => {
  if (product.availableSizes?.length && !size) {
    toast.error("Please select a size");
    return;
  }

  if (!variantId) {
    toast.error("Variant missing. Please select size and color.");
    return;
  }

  const uniqueKey = `${product.id}-${size || "default"}-${color || "nocolor"}`;
  const existingItem = bagItems.find(i => i.uniqueKey === uniqueKey);

  // 🔥 STOCK VALIDATION
  if (existingItem) {
    if (existingItem.quantity + 1 > stock) {
      toast.error(`Only ${stock} items in stock`);
      return;
    }

    await updateQuantity(uniqueKey, existingItem.quantity + 1);
    return;
  }

  if (stock < 1) {
    toast.error("Out of stock");
    return;
  }

  const res = await fetch("/api/bag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      productId: product.id,
      size,
      color,
      variantId,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.error || "Unable to add item");
    return;
  }

  await fetchBag();
  toast.success("Added to bag");
};

  const clearCart = async () => {
  try {
    // Remove all items from the cart
    await Promise.all(bagItems.map(item =>
      fetch("/api/bag", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bagId: item.id }),
      })
    ));
    setBagItems([]);
  } catch (err) {
    console.error(err);
    toast.error("Failed to clear cart");
  }
};


  const removeFromCart = async (uniqueKey: string) => {
    const item = bagItems.find((i) => i.uniqueKey === uniqueKey);
    if (!item) return;

    try {
      await fetch("/api/bag", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bagId: item.id }),
      });
      await fetchBag();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

const updateQuantity = async (uniqueKey: string, quantity: number) => {
  const item = bagItems.find((i) => i.uniqueKey === uniqueKey);
  if (!item) return;

  // 🔥 OPTIMISTIC UI
  setBagItems((prev) =>
    prev.map((i) =>
      i.uniqueKey === uniqueKey ? { ...i, quantity } : i
    )
  );

  setIsSyncing(true);

  try {
    await fetch("/api/bag", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bagId: item.id, quantity }),
    });
  } catch {
    toast.error("Failed to update quantity");
    fetchBag(); // rollback
  } finally {
    setIsSyncing(false);
  }
};



  const updateSize = async (uniqueKey: string, newSize: string) => {
    const item = bagItems.find((i) => i.uniqueKey === uniqueKey);
    if (!item) return;

   const newUniqueKey = `${item.product.id}-${newSize}-${item.color || "nocolor"}`;

    const existingItem = bagItems.find((i) => i.uniqueKey === newUniqueKey);

    if (existingItem) {
      await updateQuantity(newUniqueKey, existingItem.quantity + item.quantity);
      await removeFromCart(uniqueKey);
      return;
    }

    try {
      await fetch("/api/bag", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
   body: JSON.stringify({
  bagId: item.id,
  size: newSize,
}),


      });
      await fetchBag();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update size");
    }
  };

  const moveToWishlist = async (uniqueKey: string) => {
    const item = bagItems.find((i) => i.uniqueKey === uniqueKey);
    if (!item) return;

    try {
      await removeFromCart(uniqueKey);
      toast.success("Moved to wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to move to wishlist");
    }
  };
async function getVariantPrice(
  productId: string,
  variantId: string,
  quantity: number
) {
  const res = await fetch("/api/calculate-offer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      variantId,
      quantity,
    }),
  });

  const data = await res.json();

  return data.total;
}
  
  // -------------------
  // Derived values
  // -------------------
  const totalCount = useMemo(() => bagItems.reduce((acc: number, i: BagItem) => acc + i.quantity, 0), [bagItems]);
const subtotal = useMemo(() => {
  let total = 0;

  const grouped: Record<string, BagItem[]> = {};

  // Group products by category
  bagItems.forEach((item) => {
    const category =
      item.product.subSubSubCategory?.toLowerCase() || "default";

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(item);
  });

  // Apply bundle offers
  for (const category in grouped) {
    const items = grouped[category];
    const offer = offers[category];

    const qty = items.reduce((sum, i) => sum + i.quantity, 0);
    const price = items[0].price;

   if (offer && price === offer.price) {
  let remaining = qty;

  for (const bundle of offer.bundles) {
    const count = Math.floor(remaining / bundle.qty);

    if (count > 0) {
      total += count * bundle.price;
      remaining = remaining % bundle.qty;
    }
  }

  total += remaining * price;

    } else {
      total += items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }
  }

  return total;
}, [bagItems]);

  const shipping = useMemo(() => (subtotal > 100 ? 0 : 100), [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  // -------------------
  // Provider
  // -------------------
  return (
    <BagContext.Provider
      value={{
        bagItems,
        totalCount,
        subtotal,
        shipping,
        total,
        isSyncing,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSize,
        moveToWishlist,
        refreshBag: fetchBag,
        setBagItems,
        clearCart,
      
      }}
    >
      {children}
    </BagContext.Provider>
  );
};
