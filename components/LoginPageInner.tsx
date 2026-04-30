"use client";

import React, { useState, useEffect } from "react"; // ✅ added useEffect
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import Link from "next/link";

export default function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawRedirect = searchParams.get("redirect") || "/";
  const redirectTo = rawRedirect.startsWith("/") ? rawRedirect : `/${rawRedirect}`;

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------- 🔥 AUTO OTP DETECT (ANDROID) ---------- */
  useEffect(() => {
    if (!otpSent) return;

    if ("OTPCredential" in window) {
      const ac = new AbortController();

      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        } as any)
        .then((otpCredential: any) => {
          if (otpCredential?.code) {
            setOtp(otpCredential.code); // 🔥 auto-fill
          }
        })
        .catch(() => {});

      return () => ac.abort();
    }
  }, [otpSent]);

  /* ---------- SEND OTP ---------- */
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      return toast.error("Enter valid 10-digit phone number");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("OTP sent 📱");
      setOtpSent(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- VERIFY OTP ---------- */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) return toast.error("Enter OTP");

    setLoading(true);

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: phone, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCookie("token", data.token, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });

      toast.success("Login successful ✅");
      router.push(redirectTo);
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-xl p-8 rounded-2xl transition-all duration-200">
        
        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <img src="/images/arunodayalogo2.png" className="w-40 mb-2" />
          </Link>

          <h1 className="text-xl font-semibold mt-2">Continue</h1>

          <p className="text-sm text-gray-600 text-center mt-1">
            Enter your phone number to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleVerifyOtp} className="space-y-4">

          {!otpSent ? (
            <>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                <span className="text-gray-500 mr-2">+91</span>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full outline-none text-base"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 active:scale-[0.98] transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 text-center">
                OTP sent to +91 {phone}
              </p>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code" // ✅ iPhone
                pattern="\d{6}"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-base focus:border-black focus:ring-1 focus:ring-black outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 active:scale-[0.98] transition"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Secure login via OTP 🔐
        </p>
      </div>
    </div>
  );
}