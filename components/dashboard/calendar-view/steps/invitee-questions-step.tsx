import { HelpCircle } from "lucide-react";

interface InviteeQuestionsStepProps {}

export default function InviteeQuestionsStep({}: InviteeQuestionsStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-white mb-2">
          Invitee Questions
        </h3>
        <p className="text-gray-400">Configure questions for invitees</p>
      </div>
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
