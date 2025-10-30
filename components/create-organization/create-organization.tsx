"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Building2 } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

interface CreateOrganizationProps {
  onSuccess: () => void;
}

export default function CreateOrganization({
  onSuccess,
}: CreateOrganizationProps) {
  const [formData, setFormData] = useState({
    organizationName: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required";
    }
    if (!formData.timezone.trim()) {
      newErrors.timezone = "Timezone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Appel de l'API pour créer l'organisation
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations`,
        {
          name: formData.organizationName,
          timezone: formData.timezone,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Failed to create organization:", error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({
          general: "Failed to create organization. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-main to-green-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Create Your Organization
        </h2>
        <p className="text-gray-400 text-sm">
          Set up your organization to get started with ShowUp
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Organization Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Organization Name *
          </label>
          <input
            type="text"
            value={formData.organizationName}
            onChange={(e) =>
              handleInputChange("organizationName", e.target.value)
            }
            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all ${
              errors.organizationName ? "border-red-500" : "border-white/20"
            }`}
            placeholder="Acme Corporation"
          />
          {errors.organizationName && (
            <div className="flex items-center mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.organizationName}
            </div>
          )}
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Timezone *
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => handleInputChange("timezone", e.target.value)}
            className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main transition-all ${
              errors.timezone ? "border-red-500" : "border-white/20"
            }`}
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
            <option value="Europe/Berlin">Berlin (CET)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
            <option value="Asia/Shanghai">Shanghai (CST)</option>
            <option value="Asia/Kolkata">Mumbai (IST)</option>
            <option value="Australia/Sydney">Sydney (AEDT)</option>
          </select>
          {errors.timezone && (
            <div className="flex items-center mt-1 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.timezone}
            </div>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="flex items-center text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errors.general}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-main to-green-light hover:from-green-dark hover:to-green-main text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Creating Organization...
            </div>
          ) : (
            "Create Organization"
          )}
        </button>
      </form>
    </motion.div>
  );
}
