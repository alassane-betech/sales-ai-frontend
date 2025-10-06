"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";

interface FormStepProps {
  eventData: {
    id: string;
    name: string;
    description: string;
    duration_minutes: number;
    creator?: {
      first_name: string;
      last_name: string;
    };
  };
  onContinue: (formData: FormData) => void;
  className?: string;
}

interface FormData {
  phone: string;
  name: string;
  email?: string;
  answers?: { [key: string]: string };
}

export function FormStep({ eventData, onContinue, className }: FormStepProps) {
  const [formData, setFormData] = React.useState<FormData>({
    phone: "",
    name: "",
    email: "",
    answers: {},
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler un délai de traitement
    await new Promise((resolve) => setTimeout(resolve, 500));

    onContinue(formData);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid =
    formData.phone.trim() !== "" && formData.name.trim() !== "";

  return (
    <div className={className}>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {eventData.name}
        </h1>

        <p className="text-[#9D9DA8] text-lg mb-8">{eventData.description}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number */}
          <div>
            <div className="flex flex-row">
              <div className="flex items-center px-3 py-2 bg-[#18181B] border border-[#007953]/20 rounded-l-lg min-h-[40px]">
                <span className="text-white text-sm mr-2">🇫🇷</span>
                <span className="text-white text-sm">+33</span>
              </div>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e: any) =>
                  handleInputChange("phone", e.target.value)
                }
                placeholder="Votre numéro"
                className="rounded-l-none border-l-0 bg-[#18181B] border-[#007953]/20 text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <Input
              type="text"
              value={formData.name}
              onChange={(e: any) => handleInputChange("name", e.target.value)}
              placeholder="Name *"
              className="bg-[#18181B] border-[#007953]/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          {/* Terms & Privacy */}
          <div className="text-sm text-[#9D9DA8]">
            By entering information, I agree to{" "}
            <a
              href="#"
              className="text-[#007953] underline hover:text-[#00a86b]"
            >
              Terms
            </a>{" "}
            &{" "}
            <a
              href="#"
              className="text-[#007953] underline hover:text-[#00a86b]"
            >
              Privacy Policy
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-[#007953] hover:bg-[#00a86b] text-white py-3 text-lg font-medium"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Continue</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
