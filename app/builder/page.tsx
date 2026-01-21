import { prisma } from "@/lib/db";
import { getOwnerId } from "@/utils/getOwnerId";
import { redirect } from "next/navigation";

export default async function BuilderPage() {
  // 1️⃣ Get logged-in user id
  const ownerId = await getOwnerId();

  if (!ownerId) {
    redirect("/login");
  }

  // 2️⃣ Fetch site FIRST (before using it)
  const site = await prisma.site.findFirst({
    where: { ownerId },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
  });

  // 3️⃣ Handle no site case
  if (!site) {
    redirect("/builder/site/new");
  }

  // 4️⃣ Now it is SAFE to use `site`
  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome to <span className="text-yellow-500">{site.name}</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Manage products, orders and analytics for your store
        </p>
      </div>

      {/* SITE INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm text-gray-500">Online Store Name</p>
          <p className="font-semibold text-lg">{site.name}</p>
        </div>

        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm text-gray-500">Store URL</p>
          <p className="font-medium text-blue-600 truncate">
            /store/{site.slug}
          </p>
        </div>

        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm text-gray-500">Created On</p>
          <p className="font-medium">
            {site.createdAt.toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
