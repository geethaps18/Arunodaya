export const getShippingCharge = (pincode?: string) => {
  if (!pincode) return 49;

  const clean = pincode.trim();

  const DAVANAGERE_PINCODES = [
    "577001",
    "577002",
    "577003",
    "577004",
  ];

  const isDavanagereTown = DAVANAGERE_PINCODES.includes(clean);

  return isDavanagereTown ? 0 : 49;
};