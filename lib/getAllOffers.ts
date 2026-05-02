export function getAllOffers(offer: any) {
  if (!offer) return [];

  const list: string[] = [];

 

  // Bundles
  if (offer.bundles?.length) {
    offer.bundles.forEach((b: any) => {
      list.push(`Buy ${b.qty} for ₹${b.price}`);
    });
  }
  // -------------------------
  // 🎯 SPECIAL FREE OFFERS
  // -------------------------
  if (offer.offers?.length) {
    offer.offers.forEach((o: any) => {
      if (o.qty && o.free) {
        list.push(`Buy ${o.qty} get ${o.free} FREE`);
      }
    });
  }
  // Variants
  if (offer.variants?.length) {
    offer.variants.forEach((v: any) => {
      if (v.mrp && v.price) {
        const percent = Math.round((1 - v.price / v.mrp) * 100);
      
      }
      if (v.bundles?.length) {
        v.bundles.forEach((b: any) => {
          list.push(`Buy ${b.qty} for ₹${b.price}`);
        });
      }
    });
  }

  // Simple price offer
  if (offer.price && !offer.mrp && !offer.bundles) {
    list.push(`Special price ₹${offer.price}`);
  }

  return list;
}