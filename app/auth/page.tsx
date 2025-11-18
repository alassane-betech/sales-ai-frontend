"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SignInForm from "@/components/auth/signin-form";
import SignUpForm from "@/components/auth/signup-form";
import OTPVerification from "@/components/auth/otp-verification";
import { isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { AuthFormProvider, useAuthForm } from "@/components/auth/auth-form-context";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

function AuthContent() {
  const { mode, email, setMode } = useAuthForm();
  const isSignIn = mode === "signin";
  const isOtp = mode === "otp";
  const isForgotPassword = mode === "forgot-password";

  // Helper functions to reduce complexity
  const getPageTitle = () => {
    if (isOtp) return "Verify Your Email";
    if (isForgotPassword) return "Réinitialiser le mot de passe";
    if (isSignIn) return "Welcome back";
    return "Start your free trial";
  };

  const renderForm = () => {
    if (isOtp) {
      return (
        <OTPVerification />
      );
    }
    
    if (isSignIn) {
      return (
        <SignInForm
        />
      );
    }

    if (isForgotPassword) {
      return (
        <ForgotPasswordForm />
      );
    }
    
    return (
      <SignUpForm />
    );
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    if (isAuthenticated()) {
      window.location.href = "/dashboard";
      return;
    }

    // Hide forgot password view when switching modes
  }, [setMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023] flex items-center justify-center p-4">
      {/* Background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#007953]/30 rounded-full animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#00a86b]/40 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#007953]/50 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home */}
        {/* <Link
          href="/"
          className="inline-flex items-center text-[#9D9DA8] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link> */}

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1E1E21] backdrop-blur-md border border-[#232327] rounded-2xl px-8 py-4 shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#007953] to-[#00a86b] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#007953] to-[#00a86b] bg-clip-text text-transparent">
                ShowUp
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              {getPageTitle()}
            </h1>
            {isOtp ? (
              <p className="text-[#9D9DA8]">{`We've sent a 6-digit code to ${email}`}</p>
            ) : isSignIn ? (
              isForgotPassword ? (
                <p className="text-[#9D9DA8]">
                  Entrez votre email pour recevoir un lien de réinitialisation
                </p>
              ) : (
                <p className="text-[#9D9DA8]">
                  Sign in to your account to continue
                </p>
              )
            ) : (
              <p className="text-[#9D9DA8]">
                Get started with AI-powered sales automation
              </p>
            )}
          </div>

          {/* Form or OTP */}
          {renderForm()}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[#9D9DA8] text-sm">
              {isSignIn
                ? "Don't have an account? "
                : "Already have an account? "}
              <Button
                variant="link"
                onClick={() => {
                  const newMode = isSignIn ? "signup" : "signin";
                  setMode(newMode);
                }}
                className="text-[#007953] hover:text-[#00a86b] transition-colors font-medium"
              >
                {isSignIn ? "Start free trial" : "Sign in"}
              </Button>
            </p>
          </div>

          {/* Terms (Sign Up only) */}
          {!isSignIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-[#9D9DA8]">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-[#007953] hover:text-[#00a86b] transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#007953] hover:text-[#00a86b] transition-colors"
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

export default function AuthPage() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") || "signin") as "signin" | "signup";
  
  return (
    <AuthFormProvider initialMode={initialMode}>
      <AuthContent />
    </AuthFormProvider>
  );
}
