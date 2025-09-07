"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

interface OTPVerificationProps {
  email: string;
  otp: string;
  otpError: string;
  isLoading: boolean;
  onOtpChange: (value: string) => void;
  onBack: () => void;
  onLoadingChange: (loading: boolean) => void;
  onErrorChange: (error: string) => void;
  invitationToken?: string | null;
}

export default function OTPVerification({
  email,
  otp,
  otpError,
  isLoading,
  onOtpChange,
  onBack,
  onLoadingChange,
  onErrorChange,
  invitationToken,
}: OTPVerificationProps) {
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      onErrorChange("Please enter a valid 6-digit OTP");
      return;
    }

    onLoadingChange(true);
    onErrorChange("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        {
          email: email,
          otp: otp,
        }
      );

      if (response.status === 200) {
        const COOKIE_OPTIONS = {
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
          expires: 30, // 30 jours (1 mois)
        };

        Cookies.set("access_token", response.data.access_token, COOKIE_OPTIONS);
        Cookies.set(
          "refresh_token",
          response.data.refresh_token,
          COOKIE_OPTIONS
        );
        Cookies.set("user", JSON.stringify(response.data.user), COOKIE_OPTIONS);

        // Redirect to create organization page
        if (invitationToken) {
          window.location.href = `/join-organization?invitation_token=${invitationToken}`;
        } else {
          window.location.href = "/create-organization";
        }
      }
    } catch (error: any) {
      if (error.response) {
        onErrorChange("Invalid OTP. Please try again.");
      } else if (error.request) {
        onErrorChange("Network error. Please try again.");
      } else {
        onErrorChange("Something went wrong. Please try again.");
      }
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter OTP Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              onOtpChange(e.target.value.replace(/\D/g, "").slice(0, 6));
              if (otpError) onErrorChange("");
            }}
            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all text-center text-lg tracking-widest ${
              otpError ? "border-red-500" : "border-white/20"
            }`}
            placeholder="123456"
            maxLength={6}
          />
          {otpError && (
            <div className="flex items-center mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {otpError}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-main to-green-light hover:from-green-dark hover:to-green-main text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Verifying...
            </div>
          ) : (
            "Verify OTP"
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Back to registration
          </button>
        </div>
      </div>
    </motion.div>
  );
}
