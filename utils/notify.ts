import nodemailer from "nodemailer";

export type OrderItem = {
  name: string;
  brandName?: string;
  qty: number;
  price: number;
  size?: string;
  image?: string;
};

export type NotificationOptions = {
  email?: string;
  phone: string;
  customerName?: string;
  addressName?: string;
  addressEmail?: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  paymentMode: string;
  status: "ordered" | "packed" | "shipped" | "out_for_delivery" | "delivered";
};

// ✨ Modern Minimal Fashion Tone
const STATUS_TEXTS: Record<
  NotificationOptions["status"],
  (name: string) => string
> = {
  ordered: (name) =>
    `Hi ${name},

Your order has been placed successfully.
We’re preparing it with care.

Thank you for choosing Arunodaya Collections.`,

  packed: (name) =>
    `Hi ${name},

Your order has been packed and is ready for dispatch.
Quality checked and carefully prepared.`,

  shipped: (name) =>
    `Hi ${name},

Your order has been shipped and is on its way.
We’ll notify you once it’s out for delivery.`,

  out_for_delivery: (name) =>
    `Hi ${name},

Your order is out for delivery.
Please keep your phone accessible for the delivery partner.`,

  delivered: (name) =>
    `Hi ${name},

Your order has been successfully delivered.
We hope you love your new style.

Thank you for choosing Arunodaya Collections.`,
};

export async function sendOrderNotification(options: NotificationOptions) {
  try {
    const {
      email,
      addressEmail,
      customerName,
      addressName,
      phone,
      orderId,
      items,
      total,
      paymentMode,
      status,
    } = options;

    // --------------------------
    // CUSTOMER NAME
    // --------------------------
    let finalName =
      addressName ||
      customerName ||
      (email ? email.split("@")[0] : "") ||
      "Customer";

    finalName =
      finalName.charAt(0).toUpperCase() + finalName.slice(1).toLowerCase();

    // --------------------------
    // EMAIL
    // --------------------------
    const finalEmail =
      addressEmail && addressEmail.includes("@")
        ? addressEmail
        : email && email.includes("@")
        ? email
        : process.env.EMAIL_USER!;

    const message = STATUS_TEXTS[status](finalName);

    // --------------------------
    // ITEM TABLE
    // --------------------------
    const itemListHtml = items
      .map(
        (item) => `
<tr>
  <td style="padding:12px; border-bottom:1px solid #e5e5e5; display:flex; align-items:center;">
    ${
      item.image
        ? `<img src="${item.image}" width="60" style="margin-right:12px; border-radius:8px;" />`
        : ""
    }
    <div>
      <div style="font-weight:500; color:#111111;">
        ${item.name}${item.size ? " - " + item.size : ""}
      </div>
    </div>
  </td>
  <td style="padding:12px; border-bottom:1px solid #e5e5e5; text-align:right; color:#666;">
    x${item.qty}
  </td>
  <td style="padding:12px; border-bottom:1px solid #e5e5e5; text-align:right; font-weight:500;">
    ₹${(item.price * item.qty).toFixed(2)}
  </td>
</tr>`
      )
      .join("");

    // --------------------------
    // EMAIL TEMPLATE
    // --------------------------
    const emailHtml = `
<div style="font-family: Inter, Arial, sans-serif; max-width:650px; margin:auto; border:1px solid #e5e5e5; border-radius:14px; background:#f7f7f7; overflow:hidden;">

  <div style="background:#111111; padding:28px; text-align:center;">
    <h2 style="margin:0; color:#ffffff; font-weight:500; letter-spacing:0.5px;">
      Arunodaya Collections
    </h2>
    <p style="margin:6px 0 0; color:#aaaaaa; font-size:13px;">
      Order Update
    </p>
  </div>

  <div style="padding:24px; background:#ffffff;">
    <p style="font-size:14px; color:#333333; line-height:1.6;">
      ${message.replace(/\n/g, "<br/>")}
    </p>

    <p style="margin-top:20px; font-size:14px;">
      <strong>Order ID:</strong> ${orderId}
    </p>

    <table style="width:100%; border-collapse:collapse; margin-top:16px;">
      ${itemListHtml}
    </table>

    <div style="margin-top:20px; font-size:14px; line-height:1.8;">
      <div><strong>Total:</strong> ₹${total.toFixed(2)}</div>
      <div><strong>Payment Mode:</strong> ${paymentMode}</div>
    </div>
  </div>

  <div style="background:#111111; text-align:center; padding:14px; font-size:12px; color:#aaaaaa;">
    © ${new Date().getFullYear()} Arunodaya Collections
  </div>

</div>
`;

    // --------------------------
    // SEND EMAIL
    // --------------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"Arunodaya Collections" <${process.env.EMAIL_USER!}>`,
      to: finalEmail,
      subject: `Order Update • #${orderId} • ${status
        .replace(/_/g, " ")
        .toUpperCase()}`,
      html: emailHtml,
    });

    console.log("📧 Email sent to:", finalEmail);

    // --------------------------
    // WHATSAPP
    // --------------------------
    const itemListText = items
      .map(
        (item) =>
          `• ${item.name}${item.size ? " - " + item.size : ""} × ${item.qty}`
      )
      .join("\n");

    const whatsappBody = `${message}

Order ID: ${orderId}
━━━━━━━━━━━━━━
Items:
${itemListText}

Total: ₹${total}
Payment Mode: ${paymentMode}

Arunodaya Collections`;

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: whatsappBody },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("WhatsApp API Error:", errorData);
    }

    console.log("📲 WhatsApp sent to:", phone);
  } catch (err) {
    console.error("❌ Notification Error:", err);
  }
}
