"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, AlertCircle } from "lucide-react";
import axios from "axios";

export default function CreateEventPage({
  organizationId,
}: {
  organizationId: string;
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    location_type: "google_meet",
    organization_id: organizationId,
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

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Event slug is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log("Creating event with data:", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          location_type: formData.location_type,
          organization_id: formData.organization_id,
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Event created successfully:", response.data);
        // Reset form
        setFormData({
          name: "",
          slug: "",
          description: "",
          location_type: "google_meet",
          organization_id: organizationId,
        });
      }
    } catch (error: any) {
      console.error("Failed to create event:", error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({
          general: "Failed to create event. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-main to-green-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Create New Event
            </h2>
            <p className="text-gray-400 text-sm">Set up your event details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 bg-white/10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 ${
                  errors.name ? "border-red-500" : "border-white/20"
                }`}
                placeholder="Enter event name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                className={`w-full px-3 py-2 bg-white/10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 ${
                  errors.slug ? "border-red-500" : "border-white/20"
                }`}
                placeholder="Enter event slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.slug}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter event description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location Type
              </label>
              <select
                value={formData.location_type}
                onChange={(e) =>
                  handleInputChange("location_type", e.target.value)
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
              >
                <option value="google_meet">Google Meet</option>
                <option value="zoom">Zoom</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>

            {errors.general && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.general}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Event..." : "Create Event"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
