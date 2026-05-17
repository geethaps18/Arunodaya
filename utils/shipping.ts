export const DAVANAGERE_PINCODES = [
  "577001",
  "577002",
  "577003",
  "577004",
  "577005",
];

const FREE_DELIVERY_MIN = 500;

export const getShippingCharge = (
  pincode?: string,
  orderTotal: number = 0
) => {
  // ✅ Local Davanagere delivery always FREE
  if (
    pincode &&
    DAVANAGERE_PINCODES.includes(pincode.trim())
  ) {
    return 0;
  }

  // ✅ Outside Davanagere → free above ₹500
  if (orderTotal >= FREE_DELIVERY_MIN) {
    return 0;
  }

  // ✅ Default shipping
  return 49;
};

export const isCODAvailable = (pincode?: string) => {
  if (!pincode) return false;

  return DAVANAGERE_PINCODES.includes(
    pincode.trim()
  );
};