import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { sendSmsOtp } from "@/lib/sendSmsOtp";

// ✅ KEEP HERE (TOP OF FILE)
const normalizeContact = (contact: string) => {
  if (contact.includes("@")) return contact.trim().toLowerCase();

  // phone normalize → last 10 digits only
  return contact.replace(/\D/g, "").slice(-10);
};
// ✅ Generate 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ Send OTP via Email (Modern Black Theme)
async function sendEmailOtp(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Convert logo to base64
  const logoPath = path.join(process.cwd(), "public/images/arunodayalogo.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");

  const html = `
  <div style="font-family: Inter, Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e5e5; border-radius:14px; overflow:hidden; background:#f7f7f7;">

    <!-- Header -->
    <div style="background:#111111; padding:24px; text-align:center;">
      <img src="data:image/png;base64,${logoBase64}" alt="Arunodaya Collections" width="160" style="display:block; margin:auto;" />
      <p style="margin:10px 0 0; color:#aaaaaa; font-size:13px;">
        Secure Login Verification
      </p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff; padding:32px; text-align:center;">
      <h2 style="margin:0; font-weight:500; color:#111111;">
        Your One-Time Password
      </h2>

      <p style="margin:16px 0; font-size:14px; color:#555;">
        Use the OTP below to complete your login or signup.
      </p>

      <div style="margin:24px 0;">
        <span style="
          display:inline-block;
          background:#111111;
          color:#ffffff;
          font-size:30px;
          font-weight:600;
          padding:16px 28px;
          border-radius:8px;
          letter-spacing:6px;
        ">
          ${otp}
        </span>
      </div>

      <p style="color:#777; font-size:13px;">
        This OTP is valid for 5 minutes.
      </p>

      <p style="color:#999; font-size:12px;">
        If you did not request this code, please ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#111111; padding:18px; text-align:center; font-size:12px; color:#aaaaaa;">
      © ${new Date().getFullYear()} Arunodaya Collections <br/>
      Need help? 
     <a href="mailto:arunodayacollections25@gmail.com" style="color:#ffffff; text-decoration:none;">
  arunodayacollections25@gmail.com
</a>
      </a>
    </div>

  </div>
  `;

  await transporter.sendMail({
    from: `"Arunodaya Collections" <arunodayacollections25@gmail.com>`,
    to: email,
    subject: "Your Arunodaya Collections OTP Code",
    html,
  });
}

// ✅ Send OTP via WhatsApp
async function sendWhatsappOtp(phone: string, otp: string) {
  const url = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
   to: `91${phone}`,
      type: "text",
      text: {
        body: `Arunodaya Collections

Your OTP code is: ${otp}

This code will expire in 5 minutes.

If you did not request this, please ignore this message.`,
      },
    }),
  });
}

// ✅ Main API
export async function POST(req: Request) {
  try {
 const body = await req.json();
const contact = normalizeContact(body.contact);

    if (!contact) {
      return NextResponse.json(
        { message: "Contact is required ❌" },
        { status: 400 }
      );
    }
if (!contact.includes("@") && !/^\d{10}$/.test(contact)) {
  return NextResponse.json(
    { message: "Invalid phone number ❌" },
    { status: 400 }
  );
}
    const isEmail = contact.includes("@");
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60_000);

    // ✅ Upsert OTP in DB
    await prisma.oTP.upsert({
      where: { contact },
      update: { otp, expiresAt },
      create: { contact, otp, expiresAt },
    });

if (isEmail) {
  await sendEmailOtp(contact, otp);
} else {
  await sendSmsOtp(contact, otp);
  await sendWhatsappOtp(contact, otp); // backup
}


    return NextResponse.json({
      message: "OTP sent successfully ✅",
    });

  } catch (err: any) {
    console.error("Send OTP Error:", err);

    return NextResponse.json(
      { message: "Something went wrong ❌", error: err.message },
      { status: 500 }
    );
  }
}
