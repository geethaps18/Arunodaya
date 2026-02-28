"use client";

import Link from "next/link";

export default function DesktopFooter() {
  return (
    <footer className="hidden lg:block bg-gray-50 border-t mt-24">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-4 gap-12 text-sm text-gray-600">

        {/* BRAND */}
      <div>
  <div className="w-60 h-20 mb-2">
    <img
      src="/images/arunodayalogo1.png"
      alt="Arunodaya Logo"
      className="h-full w-auto object-contain"
    />
  </div>


          <p className="mt-2 font-medium text-gray-800">
            Arunodaya Collections
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Quality Fashion · Trusted Retail
          </p>

          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            Discover premium sarees, ethnic wear, western fashion, kids’ wear,
            jewellery, and home essentials.
          </p>
        </div>

        {/* CUSTOMER CARE */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            CUSTOMER CARE
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/store" className="hover:text-black">
                Stores & Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-black">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-black">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-black">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-black">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        {/* POLICIES */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            POLICIES
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/privacy-policy" className="hover:text-black">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-black">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-black">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-black">
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            CONTACT
          </h4>
          <p>Email: support@arunodaya.com</p>
          <p className="mt-2">Phone: +91 XXXXX XXXXX</p>
          <p className="mt-2">Karnataka, India</p>
        </div>

      </div>

      <div className="border-t py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Arunodaya Collections. All rights reserved.
      </div>
    </footer>
  );
}
