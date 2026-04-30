export async function sendSmsOtp(phone: string, otp: string) {
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
  console.log("📩 MSG91 FLOW RESPONSE:", data);
}