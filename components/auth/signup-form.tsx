"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface SignUpFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SignUpForm({
  formData,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
}: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onInputChange("firstName", e.target.value)}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all ${
                errors.firstName ? "border-red-500" : "border-white/20"
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <div className="flex items-center mt-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.firstName}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onInputChange("lastName", e.target.value)}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all ${
                errors.lastName ? "border-red-500" : "border-white/20"
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <div className="flex items-center mt-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.lastName}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all ${
            errors.email ? "border-red-500" : "border-white/20"
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

      {/* Phone */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all ${
              errors.phone ? "border-red-500" : "border-white/20"
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <div className="flex items-center mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.phone}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all pr-12 ${
              errors.password ? "border-red-500" : "border-white/20"
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
      </div>

      {/* Confirm Password */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => onInputChange("confirmPassword", e.target.value)}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all pr-12 ${
                errors.confirmPassword ? "border-red-500" : "border-white/20"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="flex items-center mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-green-main to-green-light hover:from-green-dark hover:to-green-main text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Creating account...
          </div>
        ) : (
          "Start Free Trial"
        )}
      </button>
    </form>
  );
}
