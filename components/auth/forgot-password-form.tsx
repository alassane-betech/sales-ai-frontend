"use client";

import { useState } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ForgotPasswordFormProps {
  initialEmail?: string;
  onBack: () => void;
}

export default function ForgotPasswordForm({
  initialEmail = "",
  onBack,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState<string>(initialEmail);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleRequestReset = async () => {
    if (!email) {
      setError("Veuillez saisir votre email");
      setSuccess("");
      return;
    }

    setIsSending(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        { email }
      );
      setSuccess(
        "Si un compte existe pour cet email, un lien de réinitialisation a été envoyé."
      );
    } catch (e) {
      setError(
        "Impossible d'envoyer la demande pour le moment. Réessayez plus tard."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
              if (success) setSuccess("");
            }}
            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all ${
              error ? "border-red-500" : "border-white/20"
            }`}
            placeholder="john@company.com"
          />
          {error && (
            <div className="flex items-center mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center mt-1 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              {success}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Retour à la connexion
          </button>
          <button
            type="button"
            onClick={handleRequestReset}
            disabled={isSending}
            className="py-2 px-4 bg-gradient-to-r from-green-main to-green-light hover:from-green-dark hover:to-green-main text-white font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <span className="inline-flex items-center">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                Envoi...
              </span>
            ) : (
              "Envoyer le lien"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
