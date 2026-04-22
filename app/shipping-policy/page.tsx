import Header from "@/components/Header";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ShippingPolicy() {
  return (
    <>
      {/* Header */}
      <Header />

      <main className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            Shipping & Delivery Policy
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">
            Shipping & Delivery Policy
          </h1>

          {/* Intro */}
          <p className="text-gray-700 leading-relaxed">
            Arunodaya currently delivers orders within India through third-party
            courier partners.
          </p>

          {/* Section 1 */}
          <h2 className="text-xl font-semibold mt-6">
            Order Processing
          </h2>
          <p className="mt-2 text-gray-700">
            Orders are typically processed after confirmation and may be dispatched
            within 1–3 business days.
          </p>

          {/* Section 2 */}
          <h2 className="text-xl font-semibold mt-6">
            Delivery Timeline
          </h2>
          <p className="mt-2 text-gray-700">
            Delivery timelines vary based on location and courier service and
            usually take 3–7 working days.
          </p>

          {/* Section 3 */}
          <h2 className="text-xl font-semibold mt-6">
            Shipping Charges
          </h2>
          <p className="mt-2 text-gray-700">
            Any applicable shipping charges will be communicated at the time of
            order confirmation or checkout.
          </p>

          {/* Section 4 */}
          <h2 className="text-xl font-semibold mt-6">
            Order Tracking
          </h2>
          <p className="mt-2 text-gray-700">
            Tracking information may be shared once the order is dispatched, where
            available.
          </p>

          {/* Contact */}
          <h2 className="text-xl font-semibold mt-6">
            Contact
          </h2>
          <p className="mt-2 text-gray-700">
            Email: arunodayacollections25@gmail.com <br />
            Phone: +91 8073 033 273
          </p>
        </div>
      </main>

    
    </>
  );
}