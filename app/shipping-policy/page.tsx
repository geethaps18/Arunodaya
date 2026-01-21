export const dynamic = "force-dynamic";

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        Shipping & Delivery Policy
      </h1>

      <p className="text-gray-700">
        Arunodaya currently delivers orders within India through third-party
        courier partners.
      </p>

      <h2 className="text-xl font-semibold mt-6">
        Order Processing
      </h2>
      <p>
        Orders are typically processed after confirmation and may be dispatched
        within 1–3 business days.
      </p>

      <h2 className="text-xl font-semibold mt-6">
        Delivery Timeline
      </h2>
      <p>
        Delivery timelines vary based on location and courier service and
        usually take 3–7 working days.
      </p>

      <h2 className="text-xl font-semibold mt-6">
        Shipping Charges
      </h2>
      <p>
        Any applicable shipping charges will be communicated at the time of
        order confirmation or checkout.
      </p>

      <h2 className="text-xl font-semibold mt-6">
        Order Tracking
      </h2>
      <p>
        Tracking information may be shared once the order is dispatched, where
        available.
      </p>

      <h2 className="text-xl font-semibold mt-6">
        Contact
      </h2>
      <p>Email: support@arunodaya.com</p>
    </div>
  );
}
