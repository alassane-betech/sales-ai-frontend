"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionProps {
  question: {
    id: string;
    label: string;
    help_text: string;
    type: string;
    is_required: boolean;
    min_length?: number;
    max_length?: number;
    min_number?: number;
    max_number?: number;
    earliest_date?: string;
    latest_date?: string;
    options?: Array<{
      id: string;
      label: string;
      value: string;
    }>;
  };
  value: string;
  onChange: (value: string) => void;
  isReadOnly?: boolean;
}

export function ShortAnswerQuestion({
  question,
  value,
  onChange,
  isReadOnly = false,
}: QuestionProps) {
  return (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium">
        {question.label}
        {question.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {question.help_text && (
        <p className="text-[#9D9DA8] text-xs">{question.help_text}</p>
      )}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.help_text || question.label}
        className={`bg-[#18181B] border-[#007953]/20 text-white placeholder:text-gray-400 ${
          isReadOnly ? "opacity-50 cursor-not-allowed" : ""
        }`}
        minLength={question.min_length || undefined}
        maxLength={question.max_length || undefined}
        required={question.is_required}
        disabled={isReadOnly}
      />
    </div>
  );
}

export function LongAnswerQuestion({
  question,
  value,
  onChange,
  isReadOnly = false,
}: QuestionProps) {
  return (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium">
        {question.label}
        {question.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {question.help_text && (
        <p className="text-[#9D9DA8] text-xs">{question.help_text}</p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.help_text || question.label}
        className={`w-full bg-[#18181B] border border-[#007953]/20 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 min-h-[100px] resize-y ${
          isReadOnly ? "opacity-50 cursor-not-allowed" : ""
        }`}
        minLength={question.min_length || undefined}
        maxLength={question.max_length || undefined}
        required={question.is_required}
        disabled={isReadOnly}
      />
    </div>
  );
}

export function MultipleChoiceQuestion({
  question,
  value,
  onChange,
  isReadOnly = false,
}: QuestionProps) {
  const selectedValues = value ? value.split(",") : [];

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      const newValues = [...selectedValues, optionValue];
      onChange(newValues.join(","));
    } else {
      const newValues = selectedValues.filter((v) => v !== optionValue);
      onChange(newValues.join(","));
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium">
        {question.label}
        {question.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {question.help_text && (
        <p className="text-[#9D9DA8] text-xs">{question.help_text}</p>
      )}
      <div className="space-y-2">
        {question.options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-3">
            <Checkbox
              id={option.id}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) =>
                handleOptionChange(option.value, checked as boolean)
              }
              disabled={isReadOnly}
              className={isReadOnly ? "opacity-50 cursor-not-allowed" : ""}
            />
            <label
              htmlFor={option.id}
              className="text-white text-sm cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RadioQuestion({
  question,
  value,
  onChange,
  isReadOnly = false,
}: QuestionProps) {
  return (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium">
        {question.label}
        {question.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {question.help_text && (
        <p className="text-[#9D9DA8] text-xs">{question.help_text}</p>
      )}
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={isReadOnly}
        className="space-y-2"
      >
        {question.options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-3">
            <RadioGroupItem
              value={option.value}
              id={option.id}
              className={isReadOnly ? "opacity-50 cursor-not-allowed" : ""}
            />
            <label
              htmlFor={option.id}
              className="text-white text-sm cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export function NumberQuestion({
  question,
  value,
  onChange,
  isReadOnly = false,
}: QuestionProps) {
  return (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium">
        {question.label}
        {question.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {question.help_text && (
        <p className="text-[#9D9DA8] text-xs">{question.help_text}</p>
      )}
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.help_text || question.label}
        className={`bg-[#18181B] border-[#007953]/20 text-white placeholder:text-gray-400 ${
          isReadOnly ? "opacity-50 cursor-not-allowed" : ""
        }`}
        min={question.min_number || undefined}
        max={question.max_number || undefined}
        required={question.is_required}
        disabled={isReadOnly}
      />
    </div>
  );
}

export function DateQuestion({
  question,
  value,
  onChange,
  isReadOnly = false,
}: QuestionProps) {
  return (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium">
        {question.label}
        {question.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {question.help_text && (
        <p className="text-[#9D9DA8] text-xs">{question.help_text}</p>
      )}
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-[#18181B] border-[#007953]/20 text-white placeholder:text-gray-400 ${
          isReadOnly ? "opacity-50 cursor-not-allowed" : ""
        }`}
        min={question.earliest_date || undefined}
        max={question.latest_date || undefined}
        required={question.is_required}
        disabled={isReadOnly}
      />
    </div>
  );
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  isReadOnly = false,
}: QuestionProps) {
  switch (question.type) {
    case "short_answer":
      return (
        <ShortAnswerQuestion
          question={question}
          value={value}
          onChange={onChange}
          isReadOnly={isReadOnly}
        />
      );
    case "long_answer":
      return (
        <LongAnswerQuestion
          question={question}
          value={value}
          onChange={onChange}
          isReadOnly={isReadOnly}
        />
      );
    case "multiple_choice":
      return (
        <MultipleChoiceQuestion
          question={question}
          value={value}
          onChange={onChange}
          isReadOnly={isReadOnly}
        />
      );
    case "radio":
      return (
        <RadioQuestion
          question={question}
          value={value}
          onChange={onChange}
          isReadOnly={isReadOnly}
        />
      );
    case "number":
      return (
        <NumberQuestion
          question={question}
          value={value}
          onChange={onChange}
          isReadOnly={isReadOnly}
        />
      );
    case "date":
      return (
        <DateQuestion
          question={question}
          value={value}
          onChange={onChange}
          isReadOnly={isReadOnly}
        />
      );
    default:
      return (
        <ShortAnswerQuestion
          question={question}
          value={value}
          onChange={onChange}
          isReadOnly={isReadOnly}
        />
      );
  }
}
