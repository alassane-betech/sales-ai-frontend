"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { sendTeamInvitations } from "@/lib/api/invitations";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  organizationId,
}: AddMemberModalProps) {
  const [emails, setEmails] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validEmails = emails.filter((email) => email.trim() !== "");

    if (validEmails.length === 0) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez saisir au moins une adresse email valide.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus({ type: null, message: "" });

      await sendTeamInvitations(organizationId, validEmails);

      // Close modal and reset form
      onClose();
      setEmails([""]);
      setSubmitStatus({ type: null, message: "" });
    } catch (error: any) {
      console.error("Erreur lors de l'envoi des invitations:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Erreur lors de l'envoi des invitations. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmails([""]);
    setSubmitStatus({ type: null, message: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-white/10 rounded-lg p-6 w-full max-w-md mx-4"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add Team Members</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-400 text-sm">
            Enter email addresses of team members you want to invite
          </p>

          {/* Status Message */}
          {submitStatus.type && (
            <div
              className={`p-3 rounded-lg flex items-center space-x-2 ${
                submitStatus.type === "success"
                  ? "bg-green-500/20 border border-green-500/30 text-green-300"
                  : "bg-red-500/20 border border-red-500/30 text-red-300"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{submitStatus.message}</span>
            </div>
          )}

          {/* Email Inputs */}
          <div className="space-y-3">
            {emails.map((email, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main"
                  />
                </div>
                {emails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Email Button */}
          <button
            type="button"
            onClick={handleAddEmail}
            className="w-full py-2 px-4 border border-dashed border-white/20 rounded-lg text-white/70 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Email</span>
          </button>

          {/* Modal Actions */}
          <div className="flex items-center space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 px-4 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-dark hover:to-green-main transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Invites</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
