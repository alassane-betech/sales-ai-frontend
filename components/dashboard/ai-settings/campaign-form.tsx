"use client";

import { useState } from "react";
import {
  CreateCampaignData,
  UpdateCampaignData,
  SettingsCampaign,
} from "@/lib/api/settings-campaign";

interface CampaignFormProps {
  eventId: string;
  eventName: string;
  campaign?: SettingsCampaign; // Si défini, c'est une édition
  onSave: (data: CreateCampaignData | UpdateCampaignData) => void;
  onCancel: () => void;
}

export default function CampaignForm({
  eventId,
  eventName,
  campaign,
  onSave,
  onCancel,
}: CampaignFormProps) {
  const isEditing = !!campaign;

  const [formData, setFormData] = useState({
    name: campaign?.name || "",
    system_prompt:
      campaign?.system_prompt ||
      'You\'re an AI assistant for a Realtor client. Your mission is to engage, nurture and convert inbound leads into qualified appointments through conversation.\n\nQualify using the questions provided.\nBe conversational and friendly, always acknowledging what the customer says before moving forward with the next question.\nDo not use superlatives like "Awesome!" or "Thats great!" too often. The key is to sound as natural as possible, reflecting an SMS style conversation.\nFocus on providing the best possible experience for the customer, while also prioritising conversion onto appointment\nLimit your responses to a maximum of 180 characters per response',
    delay: campaign?.delay || 30,
    call_to_action: campaign?.call_to_action || "Book your appointment now!",
    is_active: campaign?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // Pour l'édition, on n'envoie que les champs modifiables
      onSave(formData);
    } else {
      // Pour la création, on inclut l'event_id
      onSave({
        event_id: eventId,
        ...formData,
      });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          {isEditing ? "Edit Strategy" : "Create Strategy"} - {eventName}
        </h3>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="campaign-form"
            className="px-6 py-2 bg-green-main text-white rounded hover:bg-green-light transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <form
        id="campaign-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-12 gap-6"
      >
        {/* Left Column */}
        <div className="col-span-8">
          {/* Strategy Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Strategy Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-green-main"
                placeholder="Enter strategy name"
                required
              />
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white flex items-center">
                Prompt Editor
                <svg
                  className="w-4 h-4 ml-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </h4>
              <button
                type="button"
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Build My Prompt
              </button>
            </div>

            <div className="relative">
              <textarea
                value={formData.system_prompt}
                onChange={(e) =>
                  setFormData({ ...formData, system_prompt: e.target.value })
                }
                rows={8}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-green-main resize-none"
                placeholder="Enter your AI prompt instructions..."
                required
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white flex items-center mb-4">
              Adjustments
              <svg
                className="w-4 h-4 ml-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </h4>

            {/* Delay Settings */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Delay (minutes)
              </label>
              <input
                type="number"
                value={formData.delay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    delay: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:border-green-main"
                placeholder="Enter delay in minutes"
                min="0"
                required
              />
            </div>

            {/* Call to Action */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Call to Action
              </label>
              <input
                type="text"
                value={formData.call_to_action}
                onChange={(e) =>
                  setFormData({ ...formData, call_to_action: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:border-green-main"
                placeholder="Enter call to action"
                required
              />
            </div>

            {/* Active Toggle */}
            <div className="mt-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-green-main bg-gray-600 border-gray-500 rounded focus:ring-green-main focus:ring-2"
                />
                <span className="text-sm text-gray-300">Active</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
