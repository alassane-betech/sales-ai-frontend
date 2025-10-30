import { useState, useEffect } from "react";
import { HelpCircle, Mail, User, Plus, Trash2, X, Edit } from "lucide-react";
import {
  getEventQuestions,
  addEventQuestion,
  updateEventQuestion,
  deleteEventQuestion,
  QuestionData,
  QuestionOption,
} from "@/lib/api/events";

interface Question {
  id: string;
  event_id: string;
  type:
    | "short_answer"
    | "long_answer"
    | "multiple_choice"
    | "radio"
    | "number"
    | "date";
  label: string;
  help_text: string;
  is_required: boolean;
  is_active: boolean;
  position?: number;
  options: QuestionOption[];
  min_length?: number;
  max_length?: number;
  min_number?: number;
  max_number?: number;
  earliest_date?: string;
  latest_date?: string;
  created_at: string;
  updated_at: string;
}

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    question: Omit<Question, "id" | "event_id" | "created_at" | "updated_at">
  ) => void;
  eventId: string;
}

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    questionId: string,
    question: Omit<Question, "id" | "event_id" | "created_at" | "updated_at">
  ) => void;
  eventId: string;
  question: Question | null;
}

interface InviteeQuestionsStepProps {
  event?: any;
  onEventChange?: (event: any) => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  onNext?: () => void;
}

// Fonction utilitaire pour nettoyer les options avant envoi au backend
const cleanQuestionOptions = (
  options: QuestionOption[] | undefined
): QuestionOption[] => {
  return (
    options?.map((option) => ({
      label: option.label,
      value: option.value,
      position: option.position,
      is_active: option.is_active ?? true,
    })) || []
  );
};

// Composant modal pour ajouter une question
function AddQuestionModal({
  isOpen,
  onClose,
  onSave,
  eventId,
}: AddQuestionModalProps) {
  const [formData, setFormData] = useState({
    type: "short_answer" as Question["type"],
    label: "",
    help_text: "",
    is_required: true,
    is_active: true,
    min_length: undefined as number | undefined,
    max_length: undefined as number | undefined,
    min_number: undefined as number | undefined,
    max_number: undefined as number | undefined,
    earliest_date: undefined as string | undefined,
    latest_date: undefined as string | undefined,
  });

  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [newOption, setNewOption] = useState({ label: "", value: "" });

  // Réinitialiser les options quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setOptions([]);
      setNewOption({ label: "", value: "" });
    }
  }, [isOpen]);

  const questionTypes = [
    { value: "short_answer", label: "Short Answer (single-line text)" },
    { value: "long_answer", label: "Long Answer (multi-line text)" },
    { value: "multiple_choice", label: "Multiple Choice (multi-select)" },
    { value: "radio", label: "Radio (single-select)" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
  ];

  const addOption = () => {
    if (newOption.label.trim() && newOption.value.trim()) {
      const option: QuestionOption = {
        label: newOption.label.trim(),
        value: newOption.value.trim(),
        position: options.length,
      };
      setOptions([...options, option]);
      setNewOption({ label: "", value: "" });
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim() || !formData.help_text.trim()) return;

    // Vérifier que les questions à choix ont au moins 2 options
    if (
      (formData.type === "multiple_choice" || formData.type === "radio") &&
      options.length < 2
    ) {
      alert("Les questions à choix doivent avoir au moins 2 options");
      return;
    }

    // Préparer les données en s'assurant que les nombres sont bien des nombres
    const cleanedData = {
      ...formData,
      options: options,
      min_number:
        formData.min_number !== undefined
          ? Number(formData.min_number)
          : undefined,
      max_number:
        formData.max_number !== undefined
          ? Number(formData.max_number)
          : undefined,
      min_length:
        formData.min_length !== undefined
          ? Number(formData.min_length)
          : undefined,
      max_length:
        formData.max_length !== undefined
          ? Number(formData.max_length)
          : undefined,
    };

    onSave(cleanedData);

    // Reset form
    setFormData({
      type: "short_answer",
      label: "",
      help_text: "",
      is_required: true,
      is_active: true,
      min_length: undefined,
      max_length: undefined,
      min_number: undefined,
      max_number: undefined,
      earliest_date: undefined,
      latest_date: undefined,
    });
    setOptions([]);
    setNewOption({ label: "", value: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-2xl mx-4 border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Add New Question</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de question */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Question Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                const newType = e.target.value as Question["type"];
                setFormData({
                  ...formData,
                  type: newType,
                });
                // Vider les options pour les types non-choix
                if (newType !== "multiple_choice" && newType !== "radio") {
                  setOptions([]);
                }
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Nom de la question */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Question Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter question label"
              required
            />
          </div>

          {/* Help text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Help Text *
            </label>
            <input
              type="text"
              value={formData.help_text}
              onChange={(e) =>
                setFormData({ ...formData, help_text: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter help text"
              required
            />
          </div>

          {/* Required checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_required"
              checked={formData.is_required}
              onChange={(e) =>
                setFormData({ ...formData, is_required: e.target.checked })
              }
              className="w-4 h-4 text-green-600 bg-white/10 border-white/20 rounded focus:ring-green-500"
            />
            <label htmlFor="is_required" className="text-sm text-gray-300">
              Required field
            </label>
          </div>

          {/* Min/Max Length pour les questions text */}
          {(formData.type === "short_answer" ||
            formData.type === "long_answer") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Min Length
                </label>
                <input
                  type="number"
                  value={formData.min_length || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_length: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Min"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Length
                </label>
                <input
                  type="number"
                  value={formData.max_length || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_length: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Min/Max Number pour les questions number */}
          {formData.type === "number" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Min Number
                </label>
                <input
                  type="number"
                  value={formData.min_number || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_number: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Min"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Number
                </label>
                <input
                  type="number"
                  value={formData.max_number || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_number: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Max"
                />
              </div>
            </div>
          )}

          {/* Date range pour les questions date */}
          {formData.type === "date" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Earliest Date
                </label>
                <input
                  type="date"
                  value={formData.earliest_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      earliest_date: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Latest Date
                </label>
                <input
                  type="date"
                  value={formData.latest_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latest_date: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
            </div>
          )}

          {/* Options pour les questions à choix */}
          {(formData.type === "multiple_choice" ||
            formData.type === "radio") && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Options * (Ajoutez au moins 2 options)
              </label>

              {/* Liste des options existantes */}
              <div className="space-y-3 mb-4">
                {options.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    Aucune option ajoutée. Cliquez sur "Ajouter l'option"
                    ci-dessous pour commencer.
                  </div>
                ) : (
                  options.map((option, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          Option {index + 1}
                        </span>
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Label (affiché à l'utilisateur)
                          </label>
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => {
                              const newOptions = [...options];
                              newOptions[index].label = e.target.value;
                              setOptions(newOptions);
                            }}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                            placeholder="Ex: Petite entreprise"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Value (valeur technique)
                          </label>
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => {
                              const newOptions = [...options];
                              newOptions[index].value = e.target.value;
                              setOptions(newOptions);
                            }}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                            placeholder="Ex: small_company"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Ajouter une nouvelle option */}
              <div className="bg-white/5 rounded-lg p-3 border border-dashed border-white/20">
                <div className="text-center mb-3">
                  <span className="text-sm text-gray-400">
                    Ajouter une nouvelle option
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={newOption.label}
                      onChange={(e) =>
                        setNewOption({ ...newOption, label: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                      placeholder="Ex: Grande entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={newOption.value}
                      onChange={(e) =>
                        setNewOption({ ...newOption, value: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                      placeholder="Ex: large_company"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  disabled={!newOption.label.trim() || !newOption.value.trim()}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter l'option</span>
                </button>
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Composant modal pour éditer une question
function EditQuestionModal({
  isOpen,
  onClose,
  onSave,
  eventId,
  question,
}: EditQuestionModalProps) {
  const [formData, setFormData] = useState({
    type: "short_answer" as Question["type"],
    label: "",
    help_text: "",
    is_required: true,
    is_active: true,
    min_length: undefined as number | undefined,
    max_length: undefined as number | undefined,
    min_number: undefined as number | undefined,
    max_number: undefined as number | undefined,
    earliest_date: undefined as string | undefined,
    latest_date: undefined as string | undefined,
  });

  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [newOption, setNewOption] = useState({ label: "", value: "" });

  // Initialiser le formulaire avec les données de la question
  useEffect(() => {
    if (isOpen && question) {
      setFormData({
        type: question.type,
        label: question.label,
        help_text: question.help_text,
        is_required: question.is_required,
        is_active: question.is_active,
        min_length: question.min_length,
        max_length: question.max_length,
        min_number: question.min_number,
        max_number: question.max_number,
        earliest_date: question.earliest_date,
        latest_date: question.latest_date,
      });
      setOptions(question.options || []);
      setNewOption({ label: "", value: "" });
    }
  }, [isOpen, question]);

  const questionTypes = [
    { value: "short_answer", label: "Short Answer (single-line text)" },
    { value: "long_answer", label: "Long Answer (multi-line text)" },
    { value: "multiple_choice", label: "Multiple Choice (multi-select)" },
    { value: "radio", label: "Radio (single-select)" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
  ];

  const addOption = () => {
    if (newOption.label.trim() && newOption.value.trim()) {
      const option: QuestionOption = {
        label: newOption.label.trim(),
        value: newOption.value.trim(),
        position: options.length,
      };
      setOptions([...options, option]);
      setNewOption({ label: "", value: "" });
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim() || !formData.help_text.trim() || !question)
      return;

    // Vérifier que les questions à choix ont au moins 2 options
    if (
      (formData.type === "multiple_choice" || formData.type === "radio") &&
      options.length < 2
    ) {
      alert("Les questions à choix doivent avoir au moins 2 options");
      return;
    }

    // Préparer les données en s'assurant que les nombres sont bien des nombres
    const cleanedData = {
      ...formData,
      options: options,
      min_number:
        formData.min_number !== undefined
          ? Number(formData.min_number)
          : undefined,
      max_number:
        formData.max_number !== undefined
          ? Number(formData.max_number)
          : undefined,
      min_length:
        formData.min_length !== undefined
          ? Number(formData.min_length)
          : undefined,
      max_length:
        formData.max_length !== undefined
          ? Number(formData.max_length)
          : undefined,
    };

    onSave(question.id, cleanedData);

    onClose();
  };

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-2xl mx-4 border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Edit Question</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de question */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Question Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                const newType = e.target.value as Question["type"];
                setFormData({
                  ...formData,
                  type: newType,
                });
                // Vider les options pour les types non-choix
                if (newType !== "multiple_choice" && newType !== "radio") {
                  setOptions([]);
                }
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Nom de la question */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Question Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter question label"
              required
            />
          </div>

          {/* Help text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Help Text *
            </label>
            <input
              type="text"
              value={formData.help_text}
              onChange={(e) =>
                setFormData({ ...formData, help_text: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              placeholder="Enter help text"
              required
            />
          </div>

          {/* Required checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_required_edit"
              checked={formData.is_required}
              onChange={(e) =>
                setFormData({ ...formData, is_required: e.target.checked })
              }
              className="w-4 h-4 text-green-600 bg-white/10 border-white/20 rounded focus:ring-green-500"
            />
            <label htmlFor="is_required_edit" className="text-sm text-gray-300">
              Required field
            </label>
          </div>

          {/* Min/Max Length pour les questions text */}
          {(formData.type === "short_answer" ||
            formData.type === "long_answer") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Min Length
                </label>
                <input
                  type="number"
                  value={formData.min_length || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_length: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Min"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Length
                </label>
                <input
                  type="number"
                  value={formData.max_length || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_length: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Min/Max Number pour les questions number */}
          {formData.type === "number" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Min Number
                </label>
                <input
                  type="number"
                  value={formData.min_number || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_number: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Min"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Number
                </label>
                <input
                  type="number"
                  value={formData.max_number || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_number: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Max"
                />
              </div>
            </div>
          )}

          {/* Date range pour les questions date */}
          {formData.type === "date" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Earliest Date
                </label>
                <input
                  type="date"
                  value={formData.earliest_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      earliest_date: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Latest Date
                </label>
                <input
                  type="date"
                  value={formData.latest_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latest_date: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
            </div>
          )}

          {/* Options pour les questions à choix */}
          {(formData.type === "multiple_choice" ||
            formData.type === "radio") && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Options * (Ajoutez au moins 2 options)
              </label>

              {/* Liste des options existantes */}
              <div className="space-y-3 mb-4">
                {options.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    Aucune option ajoutée. Cliquez sur "Ajouter l'option"
                    ci-dessous pour commencer.
                  </div>
                ) : (
                  options.map((option, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          Option {index + 1}
                        </span>
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Label (affiché à l'utilisateur)
                          </label>
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => {
                              const newOptions = [...options];
                              newOptions[index].label = e.target.value;
                              setOptions(newOptions);
                            }}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                            placeholder="Ex: Petite entreprise"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Value (valeur technique)
                          </label>
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => {
                              const newOptions = [...options];
                              newOptions[index].value = e.target.value;
                              setOptions(newOptions);
                            }}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                            placeholder="Ex: small_company"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Ajouter une nouvelle option */}
              <div className="bg-white/5 rounded-lg p-3 border border-dashed border-white/20">
                <div className="text-center mb-3">
                  <span className="text-sm text-gray-400">
                    Ajouter une nouvelle option
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={newOption.label}
                      onChange={(e) =>
                        setNewOption({ ...newOption, label: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                      placeholder="Ex: Grande entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={newOption.value}
                      onChange={(e) =>
                        setNewOption({ ...newOption, value: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                      placeholder="Ex: large_company"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  disabled={!newOption.label.trim() || !newOption.value.trim()}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter l'option</span>
                </button>
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300"
            >
              Update Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InviteeQuestionsStep({
  event = {},
  onEventChange,
  isLoading,
  setIsLoading,
  onNext,
}: InviteeQuestionsStepProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null
  );

  // Charger les questions existantes
  useEffect(() => {
    if (event?.id) {
      loadQuestions();
    } else {
      setLoading(false);
    }
  }, [event?.id]);

  const loadQuestions = async () => {
    if (!event?.id) return;

    setLoading(true);
    try {
      const data = await getEventQuestions(event.id);
      setQuestions(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setIsModalOpen(true);
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleSaveQuestion = async (
    questionData: Omit<
      Question,
      "id" | "event_id" | "created_at" | "updated_at"
    >
  ) => {
    if (!event?.id) return;

    try {
      setIsLoading?.(true);

      // Nettoyer les options pour enlever les propriétés non autorisées
      const cleanedQuestionData = {
        ...questionData,
        options: cleanQuestionOptions(questionData.options),
      };

      // Appel API pour créer la question (sans position, le backend s'en charge)
      const createdQuestion = await addEventQuestion(
        event.id,
        cleanedQuestionData
      );

      // Ajouter la question à la liste locale
      setQuestions([...questions, createdQuestion]);
    } catch (error) {
      console.error("Erreur lors de la création de la question:", error);
      alert("Erreur lors de la création de la question. Veuillez réessayer.");
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleUpdateQuestion = async (
    questionId: string,
    questionData: Omit<
      Question,
      "id" | "event_id" | "created_at" | "updated_at"
    >
  ) => {
    if (!event?.id) return;

    try {
      setIsLoading?.(true);

      // Nettoyer les options pour enlever les propriétés non autorisées
      const cleanedQuestionData = {
        ...questionData,
        options: cleanQuestionOptions(questionData.options),
      };

      // Appel API pour modifier la question
      const updatedQuestion = await updateEventQuestion(
        event.id,
        questionId,
        cleanedQuestionData
      );

      // Mettre à jour la question dans la liste locale
      setQuestions(
        questions.map((q) => (q.id === questionId ? updatedQuestion : q))
      );
    } catch (error) {
      console.error("Erreur lors de la modification de la question:", error);
      alert(
        "Erreur lors de la modification de la question. Veuillez réessayer."
      );
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!event?.id) return;

    // Demander confirmation avant suppression
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      return;
    }

    setDeletingQuestionId(questionId);
    try {
      // Appel API pour supprimer la question
      await deleteEventQuestion(event.id, questionId);

      // Supprimer la question de la liste locale
      setQuestions(questions.filter((q) => q.id !== questionId));

      console.log("Question supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de la question:", error);
      alert(
        "Erreur lors de la suppression de la question. Veuillez réessayer."
      );
    } finally {
      setDeletingQuestionId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <h3 className="text-lg font-medium text-white mb-2">
          Invitee Questions
        </h3>
        <p className="text-gray-400">Configure questions for invitees</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Chargement des questions...</p>
          </div>
        ) : (
          <>
            {questions
              .sort((a, b) => (a.position || 0) - (b.position || 0))
              .map((question, index) => (
                <div
                  key={question.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-300">
                        {question.position}.
                      </span>
                      {question.type === "multiple_choice" ||
                      question.type === "radio" ? (
                        <HelpCircle className="w-4 h-4 text-green-400" />
                      ) : question.type === "number" ? (
                        <User className="w-4 h-4 text-green-400" />
                      ) : question.type === "date" ? (
                        <User className="w-4 h-4 text-green-400" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-green-400" />
                      )}
                      <span className="text-sm font-medium text-white">
                        {question.label} {question.is_required && "*"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => editQuestion(question)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit question"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        disabled={deletingQuestionId === question.id}
                        className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete question"
                      >
                        {deletingQuestionId === question.id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm">
                    <div className="flex items-start space-x-2">
                      <HelpCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>
                        {question.help_text}
                        {question.is_required && (
                          <span className="text-red-400 ml-1">*</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Affichage des options pour les questions à choix multiples */}
                  {question.options && question.options.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400 mb-2">Options :</p>
                      <div className="space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="text-sm text-gray-300"
                          >
                            • {option.label} ({option.value})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            <button
              onClick={addQuestion}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>

            {/* Bouton Next */}
            {onNext && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={onNext}
                  className="px-6 py-3 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal pour ajouter une question */}
      <AddQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        eventId={event?.id || ""}
      />

      {/* Modal pour éditer une question */}
      <EditQuestionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingQuestion(null);
        }}
        onSave={handleUpdateQuestion}
        eventId={event?.id || ""}
        question={editingQuestion}
      />
    </div>
  );
}

// Fonction pour valider les données de cette étape
export const validateInviteeQuestions = (formData: any) => {
  const errors: Record<string, string> = {};
  // Ajouter la validation des questions ici
  return errors;
};

// Fonction pour préparer les données à envoyer
export const prepareInviteeQuestionsData = (formData: any) => {
  return {
    // Ajouter les données des questions ici
  };
};
