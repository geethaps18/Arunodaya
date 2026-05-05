"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function CategoryClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sort = searchParams.get("sort");

  return (
    <div>
      <h1>Category Page</h1>

      <p>Sort: {sort}</p>

      <button onClick={() => router.push("?sort=price")}>
        Sort by Price
      </button>
    </div>
  );
}