import Header from "@/components/Header";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function RefundPolicy() {
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
            Refund & Support Policy
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">
            Refund & Support Policy
          </h1>

          {/* Intro */}
          <p className="text-gray-700 leading-relaxed">
            Currently, Arunodaya does not support automated order cancellation,
            return, or exchange features on the platform.
          </p>

          {/* Section 1 */}
          <h2 className="text-xl font-semibold mt-6">
            Refunds (Exceptional Cases Only)
          </h2>
          <p className="mt-2 text-gray-700 leading-relaxed">
            In rare cases such as damaged, defective, or incorrect products,
            customers may contact our support team for assistance. Refunds, if
            approved, are handled manually after verification.
          </p>

          {/* Section 2 */}
          <h2 className="text-xl font-semibold mt-6">
            Refund Processing Time
          </h2>
          <p className="mt-2 text-gray-700 leading-relaxed">
            Approved refunds are processed within 5–7 business days after internal
            review and confirmation.
          </p>

          {/* Section 3 */}
          <h2 className="text-xl font-semibold mt-6">
            Future Updates
          </h2>
          <p className="mt-2 text-gray-700 leading-relaxed">
            Order cancellation, return, and exchange features may be introduced in
            future updates based on business requirements.
          </p>

          {/* Contact */}
          <h2 className="text-xl font-semibold mt-6">
            Contact Us
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