"use client";

import * as React from "react";
import { CheckCircle } from "lucide-react";

type Step = "form" | "booking";

interface TwoStepProgressProps {
  currentStep: Step;
  className?: string;
}

export function TwoStepProgress({
  currentStep,
  className,
}: TwoStepProgressProps) {
  const steps = [
    { key: "form" as const, label: "Fill out the form" },
    { key: "booking" as const, label: "Book your event" },
  ];

  const getStepStatus = (step: (typeof steps)[0]) => {
    const stepIndex = steps.findIndex((s) => s.key === step.key);
    const currentIndex = steps.findIndex((s) => s.key === currentStep);

    if (stepIndex < currentIndex) {
      return "completed";
    }
    if (stepIndex === currentIndex) {
      return "current";
    }
    return "upcoming";
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-6">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";

            return (
              <React.Fragment key={step.key}>
                <div
                  className={`flex items-center space-x-2 ${
                    isCompleted || isCurrent
                      ? "text-[#007953]"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted || isCurrent
                        ? "bg-[#007953] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : step.key === "form" ? (
                      "1"
                    ) : (
                      "2"
                    )}
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ${
                      isCompleted ? "bg-[#007953]" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
