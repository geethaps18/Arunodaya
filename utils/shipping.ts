export const DAVANAGERE_PINCODES = [
  "577001",
  "577002",
  "577003",
  "577004",
  "577005",
];

export const getShippingCharge = (pincode?: string) => {
  if (!pincode) return 49;

  return DAVANAGERE_PINCODES.includes(pincode.trim())
    ? 0
    : 49;
};

export const isCODAvailable = (pincode?: string) => {
  if (!pincode) return false;

  return DAVANAGERE_PINCODES.includes(pincode.trim());
};