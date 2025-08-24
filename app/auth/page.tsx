"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import SignInForm from "@/components/auth/signin-form";
import SignUpForm from "@/components/auth/signup-form";
import OTPVerification from "@/components/auth/otp-verification";
import { login, setupAxiosInterceptors } from "@/lib/auth";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const [isSignIn, setIsSignIn] = useState(mode === "signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsSignIn(mode === "signin");
  }, [mode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isSignIn) {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
    } else {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignIn) {
        // Appel de l'API de connexion
        try {
          await login(formData.email, formData.password);

          // Configuration des intercepteurs axios pour les futures requêtes
          setupAxiosInterceptors();

          // Redirection vers le dashboard après connexion réussie
          window.location.href = "/dashboard";
        } catch (error: any) {
          if (error.response) {
            // Le serveur a répondu avec une erreur
            console.error("Connexion échouée:", error.response.data);
            // Vous pouvez ajouter un état d'erreur ici si nécessaire
          } else if (error.request) {
            // La requête a été faite mais aucune réponse reçue
            console.error("Erreur réseau:", error.request);
          } else {
            // Autre chose s'est passé
            console.error("Erreur:", error.message);
          }
        }
      } else {
        // Registration API call
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
            {
              email: formData.email,
              password: formData.password,
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone_number: formData.phone,
            }
          );

          // Success - show OTP verification
          setShowOTP(true);
        } catch (error: any) {
          if (error.response) {
            // Server responded with error status
            console.error("Registration failed:", error.response.data);
          } else if (error.request) {
            // Request was made but no response received
            console.error("Network error:", error.request);
          } else {
            // Something else happened
            console.error("Error:", error.message);
          }
          // Handle error - you can add error state here if needed
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      // Handle network error - you can add error state here if needed
    } finally {
      setIsLoading(false);
    }
  };

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
                ? "Welcome back"
                : "Start your free trial"}
            </h1>
            <p className="text-gray-400">
              {showOTP
                ? `We've sent a 6-digit code to ${formData.email}`
                : isSignIn
                ? "Sign in to your account to continue"
                : "Get started with AI-powered sales automation"}
            </p>
          </div>

          {/* Form or OTP */}
          {!showOTP ? (
            isSignIn ? (
              <SignInForm
                formData={{
                  email: formData.email,
                  password: formData.password,
                }}
                errors={errors}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            ) : (
              <SignUpForm
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            )
          ) : (
            <OTPVerification
              email={formData.email}
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
