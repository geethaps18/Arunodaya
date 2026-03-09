export function getOfferDisplay(offer: any) {
  if (!offer) return null;

  if (offer.bundles?.length) {
    return "Combo Offer";
  }

  if (offer.mrp && offer.price) {
    return "Special Offer";
  }

  return null;
}