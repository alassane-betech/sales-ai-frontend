"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { login } from "@/lib/auth";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthForm } from "@/components/auth/auth-form-context";
import { LoginRequest } from "@/lib/api/auth/models";
import { useMutation } from "@tanstack/react-query";

export default function SignInForm() {
  const router = useRouter();
  const { email, password, setEmail, setPassword, setMode } = useAuthForm();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string>("");
  
  const { mutate: loginMutation, isPending: isLoginLoading } = useMutation({
    mutationFn: (request: LoginRequest) => login(request),
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: any) => {
      setAuthError(error.response.data.message);
    },
  });

  const handleOpenForgot = () => {
    setMode("forgot-password");
  };

  // reset handled by child component

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setAuthError("");
    loginMutation({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auth Error */}
      {authError && (
        <div className="flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{authError}</span>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#9D9DA8] mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            if (authError) setAuthError("");
          }}
          className={`w-full px-4 py-3 bg-[#18181B] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007953] transition-all ${
            errors.email ? "border-red-500" : "border-[#007953]/20"
          }`}
          placeholder="john@company.com"
        />
        {errors.email && (
          <div className="flex items-center mt-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[#9D9DA8] mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: "" }));
              if (authError) setAuthError("");
            }}
            className={`w-full px-4 py-3 bg-[#18181B] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007953] transition-all pr-12 ${
              errors.password ? "border-red-500" : "border-[#007953]/20"
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9D9DA8] hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <div className="flex items-center mt-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.password}
          </div>
        )}

        <div className="mt-2 text-right">
          <button
            type="button"
            onClick={handleOpenForgot}
            className="text-sm text-[#9D9DA8] hover:text-white transition-colors"
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>

      </motion.div>
      </AnimatePresence>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoginLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-[#007953] to-[#00a86b] hover:from-[#00a86b] hover:to-[#007953] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007953] focus:ring-offset-2 focus:ring-offset-[#18181B] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoginLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Signing in...
          </div>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
