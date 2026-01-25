"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Heart,
  MapPin,
  LogOut,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import toast from "react-hot-toast";
import { deleteCookie } from "cookies-next";
import ProductCard from "@/components/ProductCard";
import LoadingRing from "@/components/LoadingRing";
import { signOut } from "next-auth/react";

// ----------------- Types -----------------

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentMode: string;
  address: string;
  expectedDelivery?: string;
  trackingNumber?: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
    };
  }[];
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface Address {
  id: string;
  label?: string;
  type?: string;
  name: string;
  phone: string;
  doorNumber?: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// ----------------- Component -----------------
export default function AccountInner() {
  const router = useRouter();

 const [tab, setTab] = useState<
  "orders" | "wishlist" | "addresses"|"logout"
>("orders");


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<Address>>({});

  

  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Account / Bank Details
       

        // Orders
        const resOrders = await fetch("/api/orders");
        const dataOrders = resOrders.ok ? await resOrders.json() : { orders: [] };
        setOrders(dataOrders.orders || []);

        // Wishlist
        const resWishlist = await fetch("/api/wishlist");
        const dataWishlist = resWishlist.ok ? await resWishlist.json() : { products: [] };
        setWishlist(dataWishlist.products || []);

        // Addresses
        const resAddresses = await fetch("/api/addresses");
        const dataAddresses = resAddresses.ok ? await resAddresses.json() : { addresses: [] };
        setAddresses(dataAddresses.addresses || []);
      } catch (err) {
  console.error(err);

  if (!sessionStorage.getItem("loginToastShown")) {
    toast.error("⚠️ Please login first!");
    sessionStorage.setItem("loginToastShown", "true");
 

  }
}

 finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

const handleLogout = async () => {
  deleteCookie("token", { path: "/" });
  sessionStorage.clear();

  await signOut({
    redirect: true,
    callbackUrl: "/login",
  });
};


     

  // ----------------- Address -----------------
  const startEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm(addr);
  };

  const cancelEditAddress = () => {
    setEditingAddressId(null);
    setAddressForm({});
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    if (!editingAddressId) return;

    setSaving(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingAddressId, ...addressForm }),
      });
      const data = await res.json();

      if (res.ok) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingAddressId ? data.address : a))
        );
        toast.success("✅ Address updated successfully!");
        cancelEditAddress();
      } else {
        toast.error("⚠️ " + (data.error || "Update failed"));
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

const tabs = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "logout", label: "Logout", icon: LogOut },
] as const;



  // ----------------- UI -----------------
 return (
  <>
    <Header />

    <main className="max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 space-y-6">
      

<div className="flex justify-around border-b pb-2 mb-6">
  {tabs.map(({ key, label, icon: Icon }) => {
    const active = tab === key;

    return (
      <button
        key={key}
        onClick={() => {
          if (key === "logout") {
            handleLogout();
          } else {
            setTab(key as any);
          }
        }}
        className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition
          ${
            key === "logout"
              ? "text-red-600 hover:text-red-700"
              : active
              ? "text-yellow-600"
              : "text-gray-500 hover:text-gray-700"
          }
        `}
      >
        <Icon
          className={`w-5 h-5 ${
            key === "logout"
              ? "text-red-600"
              : active
              ? "text-yellow-500"
              : ""
          }`}
        />
        {label}

        {active && key !== "logout" && (
          <span className="w-6 h-0.5 bg-yellow-500 rounded-full mt-1" />
        )}
      </button>
    );
  })}
</div>


      {/* ✅ Loader ONLY when loading */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <LoadingRing />
        </div>
      ) : (
        <>
           

            {/* Orders */}
            {tab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-gray-500">No orders found.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} className="border p-4 rounded-lg shadow-sm bg-white">
                      <p className="font-medium">Order ID: {o.id}</p>
                      <p>
                        Status: <span className="font-semibold">{o.status}</span>
                      </p>
                      <p>
                        Ordered At: {mounted ? new Date(o.createdAt).toLocaleString() : "..."}
                      </p>
                      <p>Total: ₹{o.totalAmount}</p>
                      <ul className="mt-2">
                        {o.items.map((item) => (
                          <li key={item.id}>
                            {item.product.name} x {item.quantity} - ₹{item.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            )}

          {/* Wishlist */}
{tab === "wishlist" && (
  <div className="p-1 sm:p-6">
    {wishlist.length === 0 ? (
      <p className="text-gray-500 text-center">Your wishlist is empty.</p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-0.5 sm:gap-0.5">
        {wishlist.map((item) => (
          // Here we use ProductCard, assuming wishlist items have full product data
        <ProductCard
  key={item.id}
  product={{
    id: item.id,
    name: item.name,
    price: item.price,
    mrp: item.price,
    discount: 0,
  
    images: item.images.length ? item.images : ["/placeholder.png"],
  
   // <-- required
    reviewCount: 0, // <-- required
    
    
  }}
/>

        
        ))}
      </div>
    )}
  </div>
)}


            {/* Addresses */}
            {tab === "addresses" && (
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-gray-500">No addresses found.</p>
                ) : (
                  addresses.map((a) => (
                    <div key={a.id} className="border p-4 rounded-lg shadow-sm bg-white space-y-2">
                      {editingAddressId === a.id ? (
                        <>
                          <input
                            type="text"
                            name="name"
                            value={addressForm.name || ""}
                            onChange={handleAddressChange}
                            placeholder="Full Name"
                            className="border p-2 w-full rounded"
                          />
                          <input
                            type="text"
                            name="phone"
                            value={addressForm.phone || ""}
                            onChange={handleAddressChange}
                            placeholder="Phone"
                            className="border p-2 w-full rounded"
                          />
                          <input
                            type="text"
                            name="doorNumber"
                            value={addressForm.doorNumber || ""}
                            onChange={handleAddressChange}
                            placeholder="Door No."
                            className="border p-2 w-full rounded"
                          />
                          <input
                            type="text"
                            name="street"
                            value={addressForm.street || ""}
                            onChange={handleAddressChange}
                            placeholder="Street"
                            className="border p-2 w-full rounded"
                          />
                          <input
                            type="text"
                            name="city"
                            value={addressForm.city || ""}
                            onChange={handleAddressChange}
                            placeholder="City"
                            className="border p-2 w-full rounded"
                          />
                          <input
                            type="text"
                            name="state"
                            value={addressForm.state || ""}
                            onChange={handleAddressChange}
                            placeholder="State"
                            className="border p-2 w-full rounded"
                          />
                          <input
                            type="text"
                            name="pincode"
                            value={addressForm.pincode || ""}
                            onChange={handleAddressChange}
                            placeholder="Pincode"
                            className="border p-2 w-full rounded"
                          />
                       
                        </>
                      ) : (
                        <>
                          <p className="font-medium">
                            {a.name} {a.type ? `(${a.type})` : ""}
                          </p>
                          <p>
                            {a.doorNumber}, {a.street}, {a.city}, {a.state} - {a.pincode}
                          </p>
                          <p>Phone: {a.phone}</p>
                          <button
                            onClick={() => startEditAddress(a)}
                            className="mt-2 bg-yellow-500 text-black px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}


        </main>
      


      <Footer />
    </>
  );
}
