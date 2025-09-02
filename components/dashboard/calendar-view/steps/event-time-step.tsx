import { Clock } from "lucide-react";

interface EventTimeStepProps {}

export default function EventTimeStep({}: EventTimeStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-white mb-2">Event Time</h3>
        <p className="text-gray-400">Set event date and time</p>
      </div>
    </div>
  );
}

// Fonction pour valider les données de cette étape
export const validateEventTime = (formData: any) => {
  const errors: Record<string, string> = {};
  // Ajouter la validation du temps ici
  return errors;
};

// Fonction pour préparer les données à envoyer
export const prepareEventTimeData = (formData: any) => {
  return {
    // Ajouter les données du temps ici
  };
};
