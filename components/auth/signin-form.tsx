"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { login } from "@/lib/auth";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

interface SignInFormProps {
  onForgotVisibleChange?: (visible: boolean) => void;
  invitationToken?: string | null;
}

export default function SignInForm({
  onForgotVisibleChange,
  invitationToken,
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formEmail, setFormEmail] = useState<string>("");
  const [formPassword, setFormPassword] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  // reset handled by child component

  const handleOpenForgot = () => {
    const next = !showForgot;
    setShowForgot(next);
    setResetEmail(formEmail || "");
    if (onForgotVisibleChange) onForgotVisibleChange(next);
  };

  // reset handled by child component

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formEmail) newErrors.email = "Email is required";
    if (!formPassword) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setAuthError("");
    try {
      await login(formEmail, formPassword);
      if (invitationToken) {
        window.location.href = `/join-organization?invitation_token=${invitationToken}`;
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          setAuthError("Email ou mot de passe incorrect");
        } else if (error.response.status === 400) {
          setAuthError("Données de connexion invalides");
        } else if (error.response.status === 500) {
          setAuthError("Erreur serveur. Veuillez réessayer plus tard");
        } else {
          setAuthError("Erreur de connexion. Veuillez réessayer");
        }
      } else if (error.request) {
        setAuthError(
          "Erreur de connexion au serveur. Vérifiez votre connexion internet"
        );
      } else {
        setAuthError("Une erreur inattendue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgot) {
    return (
      <ForgotPasswordForm initialEmail={resetEmail} onBack={handleOpenForgot} />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auth Error */}
      {authError && (
        <div className="flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#9D9DA8] mb-2">
          Email
        </label>
        <input
          type="email"
          value={formEmail}
          onChange={(e) => {
            setFormEmail(e.target.value);
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
            value={formPassword}
            onChange={(e) => {
              setFormPassword(e.target.value);
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-[#007953] to-[#00a86b] hover:from-[#00a86b] hover:to-[#007953] text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007953] focus:ring-offset-2 focus:ring-offset-[#18181B] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
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
