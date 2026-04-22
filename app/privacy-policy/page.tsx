import Header from "@/components/Header";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PrivacyPolicy() {
  return (
    <>
      {/* Top Navigation */}
      <Header />

      <main className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-10">

          {/* Breadcrumb Navigation */}
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            Privacy Policy
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {/* Intro */}
          <p className="text-gray-700 leading-relaxed">
            Arunodaya (“we”, “our”, “us”) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your
            information when you use our website and services.
          </p>

          {/* Section 1 */}
          <h2 className="text-xl font-semibold mt-8">Information We Collect</h2>
          <ul className="list-disc ml-6 mt-3 space-y-1 text-gray-700">
            <li>Name, email address, and phone number</li>
            <li>Billing and shipping address</li>
            <li>Order and purchase history</li>
            <li>Basic usage data to improve our services</li>
          </ul>

          {/* Section 2 */}
          <h2 className="text-xl font-semibold mt-8">How We Use Your Information</h2>
          <ul className="list-disc ml-6 mt-3 space-y-1 text-gray-700">
            <li>To process and deliver orders</li>
            <li>To provide customer support</li>
            <li>To improve our products and user experience</li>
            <li>To communicate important updates</li>
          </ul>

          {/* Section 3 */}
          <h2 className="text-xl font-semibold mt-8">Payment Information</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            We use secure third-party payment gateways such as Razorpay to process
            payments. We do not store or process sensitive payment information such
            as card or UPI details on our servers.
          </p>

          {/* Section 4 */}
          <h2 className="text-xl font-semibold mt-8">Contact Us</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Email: arunodayacollections25@gmail.com <br />
            Phone: +91 8073 033 273
          </p>
        </div>
      </main>

     
    </>
  );
}