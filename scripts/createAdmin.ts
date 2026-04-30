import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "geethaps2001@gmail.com" },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: "geethaps2001@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      name: "Admin",
    },
  });

  console.log("Admin created ✅");
}

main();