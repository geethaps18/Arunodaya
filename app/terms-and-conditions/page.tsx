import Header from "@/components/Header";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function TermsAndConditions() {
  return (
    <>
      {/* Top Navbar */}
      <Header />

      <main className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Breadcrumb Navigation */}
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            Terms & Conditions
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">
            Terms & Conditions
          </h1>

          <p className="text-gray-700">
            By using Arunodaya, you agree to the following terms:
          </p>

          {/* Section 1 */}
          <h2 className="text-xl font-semibold mt-6">Use of Website</h2>
          <p className="text-gray-700 mt-2">
            You must use this website responsibly and not engage in fraudulent activity.
          </p>

          {/* Section 2 */}
          <h2 className="text-xl font-semibold mt-6">Products & Pricing</h2>
          <p className="text-gray-700 mt-2">
            We ensure accurate product details, but slight variations may occur.
            Prices may change without notice.
          </p>

          {/* Section 3 */}
          <h2 className="text-xl font-semibold mt-6">Orders</h2>
          <p className="text-gray-700 mt-2">
            Orders are accepted only after payment confirmation (except COD).
            We reserve the right to cancel fraudulent orders.
          </p>

          {/* Section 4 */}
          <h2 className="text-xl font-semibold mt-6">Payments</h2>
          <p className="text-gray-700 mt-2">
            All online payments are securely processed through Razorpay.
          </p>

          {/* Section 5 */}
          <h2 className="text-xl font-semibold mt-6">Contact</h2>
          <p className="mt-2 text-gray-700">
            Email: arunodayacollections25@gmail.com <br />
            Phone: +91 8073 033 273
          </p>
        </div>
      </main>

      {/* Footer */}
      
    </>
  );
}