export const dynamic = "force-dynamic";



export default function PrivacyPolicy() {
  return (
    <>
    

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mt-6 text-gray-700 leading-relaxed">
          Arunodaya (“we”, “our”, “us”) is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, and safeguard your
          information when you use our website and services.
        </p>

        <h2 className="text-xl font-semibold mt-8">Information We Collect</h2>
        <ul className="list-disc ml-6 mt-3 space-y-1 text-gray-700">
          <li>Name, email address, and phone number</li>
          <li>Billing and shipping address</li>
          <li>Order and purchase history</li>
          <li>Basic usage data to improve our services</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">How We Use Your Information</h2>
        <ul className="list-disc ml-6 mt-3 space-y-1 text-gray-700">
          <li>To process and deliver orders</li>
          <li>To provide customer support</li>
          <li>To improve our products and user experience</li>
          <li>To communicate important updates</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Payment Information</h2>
        <p className="mt-3 text-gray-700 leading-relaxed">
          We use secure third-party payment gateways such as Razorpay to process
          payments. We do not store or process sensitive payment information such
          as card or UPI details on our servers.
        </p>

        <h2 className="text-xl font-semibold mt-8">Contact Us</h2>
        <p className="mt-3 text-gray-700">
          Email: support@arunodaya.com <br />
          Phone: +91 XXXXXXXXXX
        </p>
      </div>

   
    </>
  );
}
