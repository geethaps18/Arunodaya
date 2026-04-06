"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import LoadingRing from "./LoadingRing";
import CheckoutStepper from "@/components/CheckoutStepper";
import { getCookie } from "cookies-next";
import { offers } from "@/data/offers";

interface BagItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  productName: string;

  category?: string; // ⭐ ADD THIS

  size?: string | null;
  color?: string | null;
  variantId?: string | null;
}


interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface Address {
  id: string;
  type: string;
  name: string;
  phone: string;
  doorNumber?: string;
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export default function PaymentPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode");
const isBuyNow = mode === "buynow";
const [isBagLoading, setIsBagLoading] = useState(true);
const [isAddressLoading, setIsAddressLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
 const [paymentMode, setPaymentMode] = useState<"COD" | "ONLINE">("COD");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [upiId, setUpiId] = useState<string>("");
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const addressId = params.get("addressId");
  const shipping = Number(params.get("shipping") ?? 0);
  const discount = Number(params.get("discount") ?? 0);

  const subtotal = bagItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0);
  // ---------------- PRICE LOGIC (SINGLE SOURCE) ----------------
// ---------------- PRICE LOGIC (SINGLE SOURCE OF TRUTH) ----------------

// -------- BUNDLE PRICE ENGINE --------

const totalSelling = (() => {
  let total = 0;

  const grouped: Record<string, BagItem[]> = {};

  bagItems.forEach((item) => {
   const category = item.category || "default";

    if (!grouped[category]) grouped[category] = [];

    grouped[category].push(item);
  });

  for (const category in grouped) {
    const items = grouped[category];
    const offer = offers[category];

    const qty = items.reduce((s, i) => s + i.quantity, 0);
    const price = items[0]?.price ?? 0;

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
      total += items.reduce((s, i) => s + i.price * i.quantity, 0);
    }
  }

  return total;
})();

const shippingCharge = totalSelling >= 100 ? 0 : 100;

const finalOrderTotal = totalSelling + shippingCharge;

const formattedTotal = `₹${finalOrderTotal.toFixed(2)}`;




  // Decode JWT
  useEffect(() => {
    const token = getCookie("token");
    if (!token || typeof token !== "string") {
      setUserId(null);
      setLoading(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.userId || null);
    } catch (err) {
      console.error("Invalid JWT:", err);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Bag
useEffect(() => {
  if (!userId) return;

  // ==========================
  // 🚀 BUY NOW MODE
  // ==========================
  if (isBuyNow) {
    const raw = sessionStorage.getItem("BUY_NOW_ITEM");

    if (raw) {
      const item = JSON.parse(raw);

      setBagItems([
        {
          id: "buynow",
          productId: item.id,
          quantity: 1,
          price: item.price,
          productName: item.name,
          size: item.size ?? null,
          color: item.color ?? null,
          variantId: item.variantId ?? null,
        },
      ]);
    }

    return; // 🔥 DO NOT FETCH BAG
  }

  // ==========================
  // 👜 NORMAL BAG MODE
  // ==========================
  const fetchBag = async () => {
    try {
      const res = await fetch(`/api/bag?userId=${userId}`);
      const data = await res.json();

      if (data.items) {
       const mappedItems: BagItem[] = data.items.map((item: any) => ({
  id: item.id,
  productId: item.product.id,
  quantity: item.quantity,
  price: item.price,
  productName: item.product.name ?? "Product",

  category: item.product.subSubSubCategory?.toLowerCase(), // ⭐ ADD

  size: item.size ?? null,
  color: item.color ?? null,
  variantId: item.variantId ?? null,
}));
        setBagItems(mappedItems);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bag items");
    }
  };

  fetchBag();
}, [userId, isBuyNow]);


  // Fetch Address
  useEffect(() => {
    if (!addressId) return;
    const fetchAddress = async () => {
      try {
        const res = await fetch(`/api/addresses/${addressId}`);
        const data = await res.json();
        if (data.address) setSelectedAddress(data.address);
      } catch (err) {
        console.error("Failed to fetch address:", err);
      }
    };
    fetchAddress();
  }, [addressId]);

  const handleRazorpayPayment = async () => {
  if (!userId) return toast.error("User not found");

  const res = await fetch("/api/razorpay-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ amount: finalOrderTotal })

  });

  const data = await res.json();
  if (!data.success) {
    toast.error("Failed to create order");
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    amount: finalOrderTotal * 100,

    currency: "INR",
    name: "Arunodaya Collections",
    description: "Order Payment",
    order_id: data.orderId,
    handler: function (response) {
      router.push(`/payment-success?razorpay_payment_id=${response.razorpay_payment_id}`);
    },
    theme: {
      color: "black",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

  const handlePayment = () => {
  if (paymentMode === "COD") {
  createCODOrder();
} else if (paymentMode === "ONLINE") {
  handleRazorpayPayment();
} else {
      toast.error("Select a valid payment method");
    }
  };

  const createCODOrder = async () => {
    if (!userId || !selectedAddress || bagItems.length === 0) return;

    try {
      setLoading(true);

     const orderItems = bagItems.map((item) => ({
  productId: item.productId,
  quantity: item.quantity,
  price: item.price,
  size: item.size,
  color: item.color,          // ✅ ADD
  variantId: item.variantId,  // 🔥 THIS FIXES EVERYTHING
}));

const invalidItem = bagItems.find(i => !i.variantId);

if (invalidItem) {
  toast.error(
    `Please reselect size / color for ${invalidItem.productName}`
  );
  router.push(`/product/${invalidItem.productId}`);
  return;
}

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          items: orderItems,
          totalAmount: finalOrderTotal,
          paymentMode: "COD",
          address: selectedAddress,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        toast.success("Order placed successfully!");
        router.push(`/order-success/${data.order.id}`);
      } else {
        toast.error(data.error || "COD order failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("COD order failed");
      setLoading(false);
    }
  };
if (loading)
  return (
    <div className="flex justify-center items-center py-20">
      <LoadingRing />
    </div>
  );
  if (!userId) return <p className="mt-20 text-center">Please login to proceed with payment.</p>;

  return (
    <div className="flex flex-col min-h-screen pt-0">
      <CheckoutStepper />
      
      <div className="max-w-2xl mx-auto mt-4 px-4">
 <div
  className="flex items-center gap-3 rounded-2xl
             bg-gray-50
             border border-gray-200
             px-5 py-4 shadow-sm"
>

    <span className="text-2xl">🎉</span>

    <div>
    <p className="text-sm font-semibold text-gray-900">
  Best price applied
</p>
<p className="text-xs text-gray-500">
  Offers and discounts were applied to your order
</p>

    </div>
  </div>
</div>

      <div className="max-w-2xl mx-auto p-4 flex-grow w-full">
  

        {/* --- Address Card --- */}
        {selectedAddress && (
         <div className="border border-gray-200 p-5 rounded-xl mb-4 bg-gray-50">
 <h3 className="font-semibold text-gray-900">{selectedAddress.type} Address</h3>
            <p>
              {selectedAddress.name} ({selectedAddress.phone})
            </p>
            <p>
              {selectedAddress.doorNumber}, {selectedAddress.street}{" "}
              {selectedAddress.landmark ? `, ${selectedAddress.landmark}` : ""},{" "}
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
            </p>
          </div>
        )}     

        {/* Payment Methods */}
        <div className="mb-24">
          <h3 className="font-medium mb-3 text-lg">Choose Payment Method</h3>

          {/* COD */}
          <label
  className={`flex justify-between items-center p-8 border rounded-lg cursor-pointer transition-all ${
    paymentMode === "COD"
      ? "border-black shadow-md bg-gray-50"
      : "bg-white hover:shadow-md"
  }`}
>
  <div className="flex  items-center gap-3 ">
    <input
      type="radio"
      value="COD"
      checked={paymentMode === "COD"}
      onChange={() => setPaymentMode("COD")}
      className="accent-black"
    />
    <img src="/images/COD.png" alt="COD" className="w-10 h-10 rounded-full" />
    <span className="font-medium">Cash on Delivery</span>
  </div>

  {/* TOTAL */}
  <span className="text-sm font-semibold text-gray-900">
    {formattedTotal}
  </span>
</label>


          {/* UPI Section */}
   <label
  className={`flex justify-between items-center p-8 border rounded-lg cursor-pointer ${
    paymentMode === "ONLINE"
      ? "border-black shadow-md bg-gray-100"
      : "bg-white hover:shadow-md"
  }`}
>
  <div className="flex items-center gap-3">
    <input
      type="radio"
      value="ONLINE"
      checked={paymentMode === "ONLINE"}
      onChange={() => setPaymentMode("ONLINE")}
      className="accent-black"
    />
    <img src="/images/upi.png" className="w-10 h-10" />
    <span className="font-medium">
      UPI / Cards / Net Banking
    </span>
  </div>

  <span className="text-sm font-semibold">
    {formattedTotal}
  </span>
</label>

  

        </div>
<div className="hidden md:flex flex-col gap-3 mt-4">
  <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-900 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition flex flex-col items-center"
          >
            <span className="text-white text-sm">₹{finalOrderTotal.toFixed(2)}</span>
            <span className="text-white font-bold">
              {loading ? "Processing..." : paymentMode === "COD" ? "Place Order" : "Pay Now"}
            </span>
          </button>
</div>
        {/* Bottom Payment Button */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white  flex gap-2 p-3 z-50">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition flex flex-col items-center"
          >
            <span className="text-white text-sm">₹{finalOrderTotal.toFixed(2)}</span>
            <span className="text-white font-bold">
              {loading ? "Processing..." : paymentMode === "COD" ? "Place Order" : "Pay Now"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
