import { IVariant } from "@/models/Product";

export function calculateVariantOffer(
  variant: IVariant,
  quantity: number
) {
  const rule = variant.offers.find(
    (r) => quantity >= r.minQty && quantity <= r.maxQty
  );

  if (!rule) {
    return {
      type: "BASE",
      total: variant.basePrice * quantity,
      freeProducts: [],
    };
  }

  switch (rule.discountType) {
    case "CASH":
      return {
        type: "CASH",
        total: (rule.pricePerUnit || 0) * quantity,
        freeProducts: [],
      };

    case "PERCENT":
      const discounted =
        variant.basePrice -
        (variant.basePrice * (rule.percentOff || 0)) / 100;

      return {
        type: "PERCENT",
        total: discounted * quantity,
        freeProducts: [],
      };

    case "PRODUCT":
      return {
        type: "PRODUCT",
        total: variant.basePrice * quantity,
        freeProducts: rule.freeProductConfig,
      };

    default:
      return {
        type: "BASE",
        total: variant.basePrice * quantity,
        freeProducts: [],
      };
  }
}