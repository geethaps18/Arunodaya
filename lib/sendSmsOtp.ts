const otpRequestMap = new Map<
  string,
  {
    count: number;
    firstRequestTime: number;
    lastRequestTime: number;
  }
>();

export async function sendSmsOtp(phone: string, otp: string) {
  try {
    const now = Date.now();

    const existing = otpRequestMap.get(phone);

    // =========================
    // FIRST REQUEST
    // =========================
    if (!existing) {
      otpRequestMap.set(phone, {
        count: 1,
        firstRequestTime: now,
        lastRequestTime: now,
      });
    } else {
      // =========================
      // 30 SEC COOLDOWN
      // =========================
      const secondsPassed = now - existing.lastRequestTime;

      if (secondsPassed < 30 * 1000) {
        throw new Error(
          "Please wait 30 seconds before requesting another OTP."
        );
      }

      // =========================
      // RESET AFTER 15 MINUTES
      // =========================
      const minutesPassed = now - existing.firstRequestTime;

      if (minutesPassed > 15 * 60 * 1000) {
        otpRequestMap.set(phone, {
          count: 1,
          firstRequestTime: now,
          lastRequestTime: now,
        });
      } else {
        // =========================
        // MAX 3 OTP REQUESTS
        // =========================
        if (existing.count >= 3) {
          throw new Error(
            "Maximum OTP limit reached. Please try again after 15 minutes."
          );
        }

        otpRequestMap.set(phone, {
          count: existing.count + 1,
          firstRequestTime: existing.firstRequestTime,
          lastRequestTime: now,
        });
      }
    }

    // =========================
    // SEND SMS
    // =========================
    const res = await fetch(
      "https://control.msg91.com/api/v5/oneapi/api/flow/arunodaya-otp-flow/run",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authkey: process.env.MSG91_AUTH_KEY!,
        },
        body: JSON.stringify({
          data: {
            sendTo: [
              {
                to: [
                  {
                    mobiles: `91${phone}`,
                    variables: {
                      numeric: {
                        value: otp,
                      },
                    },
                  },
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await res.json();

    console.log("📩 MSG91 STATUS:", res.status);
    console.log("📩 MSG91 RESPONSE:", data);

    if (!res.ok || data?.type === "error") {
  throw new Error(data?.message || "Failed to send OTP");
}

    return data;
  } catch (error) {
    console.error("❌ OTP ERROR:", error);
    throw error;
  }
}