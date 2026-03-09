import { calculateVariantOffer } from "./calculateVariantOffer";
import { IVariant } from "@/models/Product";

interface CartItem {
  variant: IVariant;
  quantity: number;
}

export function calculateCartTotal(cartItems: CartItem[]) {
  let total = 0;

  cartItems.forEach((item) => {
    const result = calculateVariantOffer(
      item.variant,
      item.quantity
    );

    total += result.total;
  });

  return total;
}