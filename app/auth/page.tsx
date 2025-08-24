"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SignInForm from "@/components/auth/signin-form";
import SignUpForm from "@/components/auth/signup-form";
import OTPVerification from "@/components/auth/otp-verification";
import { isAuthenticated } from "@/lib/auth";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const [isSignIn, setIsSignIn] = useState(mode === "signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isForgotVisible, setIsForgotVisible] = useState(false);

  // Email used for OTP and header context only
  const [otpEmail, setOtpEmail] = useState("");

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    if (isAuthenticated()) {
      window.location.href = "/dashboard";
      return;
    }

    setIsSignIn(mode === "signin");
    // Hide forgot password view when switching modes
    setIsForgotVisible(false);
  }, [mode]);

  useEffect(() => {
    const reset = searchParams.get("reset");
    if (reset === "success") {
      console.log("Mot de passe mis à jour. Vous pouvez vous connecter.");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      {/* Background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-main/30 rounded-full animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-3 h-3 bg-green-light/40 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-main/50 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-main to-green-light rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-main to-green-light bg-clip-text text-transparent">
                SalesAI
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              {showOTP
                ? "Verify Your Email"
                : isSignIn
                ? isForgotVisible
                  ? "Réinitialiser le mot de passe"
                  : "Welcome back"
                : "Start your free trial"}
            </h1>
            {showOTP ? (
              <p className="text-gray-400">{`We've sent a 6-digit code to ${otpEmail}`}</p>
            ) : isSignIn ? (
              isForgotVisible ? (
                <p className="text-gray-400">
                  Entrez votre email pour recevoir un lien de réinitialisation
                </p>
              ) : (
                <p className="text-gray-400">
                  Sign in to your account to continue
                </p>
              )
            ) : (
              <p className="text-gray-400">
                Get started with AI-powered sales automation
              </p>
            )}
          </div>

          {/* Form or OTP */}
          {!showOTP ? (
            isSignIn ? (
              <SignInForm onForgotVisibleChange={setIsForgotVisible} />
            ) : (
              <SignUpForm
                onStartOtp={(email) => {
                  setOtpEmail(email);
                  setShowOTP(true);
                }}
              />
            )
          ) : (
            <OTPVerification
              email={otpEmail}
              otp={otp}
              otpError={otpError}
              isLoading={isLoading}
              onOtpChange={(value) => {
                setOtp(value);
                if (otpError) setOtpError("");
              }}
              onBack={() => {
                setShowOTP(false);
                setOtp("");
                setOtpError("");
              }}
              onLoadingChange={setIsLoading}
              onErrorChange={setOtpError}
            />
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              {isSignIn
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                href={isSignIn ? "/auth?mode=signup" : "/auth?mode=signin"}
                className="text-green-main hover:text-green-light transition-colors font-medium"
              >
                {isSignIn ? "Start free trial" : "Sign in"}
              </Link>
            </p>
          </div>

          {/* Terms (Sign Up only) */}
          {!isSignIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-green-main hover:text-green-light transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-green-main hover:text-green-light transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
