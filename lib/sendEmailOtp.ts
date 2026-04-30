import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function sendEmailOtp(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const logoPath = path.join(process.cwd(), "public/images/arunodayalogo.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");

  const html = `
  <div style="font-family: Inter, Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e5e5; border-radius:14px; overflow:hidden; background:#f7f7f7;">

    <div style="background:#111111; padding:24px; text-align:center;">
      <img src="data:image/png;base64,${logoBase64}" width="140"/>
      <p style="color:#aaa; font-size:13px;">Secure Login Verification</p>
    </div>

    <div style="background:#fff; padding:32px; text-align:center;">
      <h2>Your OTP Code</h2>

      <div style="margin:20px 0;">
        <span style="
          background:#111;
          color:#fff;
          font-size:30px;
          padding:14px 24px;
          border-radius:8px;
          letter-spacing:6px;
        ">
          ${otp}
        </span>
      </div>

      <p style="color:#777;">Valid for 5 minutes</p>
    </div>

    <div style="background:#111; color:#aaa; padding:14px; text-align:center; font-size:12px;">
      © ${new Date().getFullYear()} Arunodaya Collections
    </div>

  </div>
  `;

  await transporter.sendMail({
    from: `"Arunodaya Collections" <arunodayacollections25@gmail.com>`,
    to: email,
    subject: "Your OTP Code",
    html,
  });
}