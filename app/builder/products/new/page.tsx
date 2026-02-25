"use client";

import { useSite } from "@/components/SiteContext";
import AddProductFormTabbed from "@/components/AddProductForm";

export default function NewProductPage() {
  const { siteId } = useSite();

  if (!siteId) {
    return <div>Please select a website</div>;
  }

  return (
    <AddProductFormTabbed
      mode="add"
      siteId={siteId}
    />
  );
}