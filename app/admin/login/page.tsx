"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<"login" | "otp">("login");
  const [loading, setLoading] = useState(false);

  /* ---------- LOGIN ---------- */
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("OTP sent to email 📩");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- VERIFY OTP ---------- */
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      document.cookie = `token=${data.token}; path=/`;

      toast.success("Login successful ✅");

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/admin/store");
      }

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-xl">

        {/* 🔥 LOGO */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <img
              src="/images/arunodayalogo2.png"
              alt="Logo"
              className="w-40 cursor-pointer"
            />
          </Link>

          <h1 className="text-xl font-semibold mt-4">
            Admin / Staff Login
          </h1>
        </div>

        {/* ---------- FORM ---------- */}
        <div className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="email@example.com"
            className="w-full border px-3 py-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* LOGIN STEP */}
          {step === "login" && (
            <>
              <input
                type="password"
                placeholder="Password"
                className="w-full border px-3 py-2 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <>
              <input
                placeholder="Enter OTP"
                className="w-full border px-3 py-2 rounded-md"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              {/* 🔁 BACK OPTION */}
              <button
                onClick={() => setStep("login")}
                className="w-full text-sm text-gray-500 hover:underline"
              >
                Change email or password
              </button>
            </>
          )}
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Secure admin access 🔐
        </p>
      </div>
    </div>
  );
}