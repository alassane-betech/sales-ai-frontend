import { XCircle } from "lucide-react";

interface DisqualificationsStepProps {}

export default function DisqualificationsStep({}: DisqualificationsStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-white mb-2">
          Disqualifications
        </h3>
        <p className="text-gray-400">Set disqualification criteria</p>
      </div>
    </div>
  );
}

// Fonction pour valider les données de cette étape
export const validateDisqualifications = (formData: any) => {
  const errors: Record<string, string> = {};
  // Ajouter la validation des disqualifications ici
  return errors;
};

// Fonction pour préparer les données à envoyer
export const prepareDisqualificationsData = (formData: any) => {
  return {
    // Ajouter les données des disqualifications ici
  };
};
