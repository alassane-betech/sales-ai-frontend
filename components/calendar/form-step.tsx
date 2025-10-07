"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { QuestionRenderer } from "./question-types";

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
  questions?: any[];
  onContinue: (formData: FormData) => void;
  onGoBack?: () => void;
  isReadOnly?: boolean;
  className?: string;
}

interface FormData {
  phone: string;
  name: string;
  email?: string;
  answers?: { [key: string]: string };
}

export function FormStep({
  eventData,
  onContinue,
  onGoBack,
  className,
  questions,
  isReadOnly = false,
}: FormStepProps) {
  const [formData, setFormData] = React.useState<FormData>({
    phone: "",
    name: "",
    email: "",
    answers: {},
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showQuestions, setShowQuestions] = React.useState(false);

  // Vérifier si les champs obligatoires de base sont remplis
  const basicFieldsValid =
    formData.phone.trim() !== "" && formData.name.trim() !== "";

  // Vérifier si toutes les questions obligatoires sont remplies
  const requiredQuestions = questions?.filter((q) => q.is_required) || [];
  const allRequiredQuestionsAnswered = requiredQuestions.every((question) => {
    const answer = formData.answers?.[question.id];
    return answer && answer.trim() !== "";
  });

  // Afficher les questions dès que les champs de base sont remplis
  React.useEffect(() => {
    if (basicFieldsValid && questions && questions.length > 0) {
      setShowQuestions(true);
    }
  }, [basicFieldsValid, questions]);

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

  const handleAnswerChange = (questionId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));
  };

  // Le formulaire est valide si les champs de base sont remplis ET toutes les questions obligatoires sont répondues
  const isFormValid = basicFieldsValid && allRequiredQuestionsAnswered;

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
                className={`rounded-l-none border-l-0 bg-[#18181B] border-[#007953]/20 text-white placeholder:text-gray-400 ${
                  isReadOnly ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isReadOnly}
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
              className={`bg-[#18181B] border-[#007953]/20 text-white placeholder:text-gray-400 ${
                isReadOnly ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isReadOnly}
              required
            />
          </div>

          {/* Questions dynamiques */}
          {showQuestions && questions && questions.length > 0 && (
            <div
              className={`space-y-6 mt-8 ${
                isReadOnly ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="border-t border-[#232327] pt-6">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Questions supplémentaires
                </h3>
                <div className="space-y-6">
                  {questions
                    .sort((a, b) => a.position - b.position)
                    .map((question) => (
                      <QuestionRenderer
                        key={question.id}
                        question={question}
                        value={formData.answers?.[question.id] || ""}
                        onChange={(value) =>
                          handleAnswerChange(question.id, value)
                        }
                        isReadOnly={isReadOnly}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}

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

          {/* Buttons */}
          <div className="space-y-3">
            {isReadOnly && onGoBack && (
              <Button
                type="button"
                onClick={onGoBack}
                variant="outline"
                className="w-full border-[#007953]/30 text-[#007953] hover:bg-[#007953]/10 py-3 text-lg font-medium"
              >
                <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                Modifier les informations
              </Button>
            )}

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
                  <span>
                    {showQuestions && !allRequiredQuestionsAnswered
                      ? "Répondez aux questions obligatoires"
                      : "Continuer vers le calendrier"}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
