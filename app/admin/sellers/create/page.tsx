"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminCreateSellerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    brandName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   if (!form.name || !form.phone || !form.brandName || !form.email) {
  toast.error("Please fill all required fields");
  return;
}


    setLoading(true);

    try {
      const res = await fetch("/api/admin/seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create online store");
      }

      toast.success("Online store created successfully");

      router.push("/admin/sellers");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Create Online Store
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Store Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Arunodaya – Davanagere"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Store Phone Number *
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="9876543210"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Store Login Email
          </label>
         <input
  type="email"
  name="email"
  value={form.email}
  onChange={handleChange}
  placeholder="store@email.com"
  className="w-full border rounded-lg px-4 py-2"
  required
/>

          <p className="text-xs text-gray-500 mt-1">
           Store Email (Must be a new, unused email)

          </p>
        </div>

        {/* Storefront Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Storefront Name *
          </label>
          <input
            type="text"
            name="brandName"
            value={form.brandName}
            onChange={handleChange}
            placeholder="Arunodaya Collections"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be used to create the online storefront
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Online Store"}
        </button>
      </form>
    </div>
  );
}
