import { Users } from "lucide-react";

interface HostsStepProps {}

export default function HostsStep({}: HostsStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-white mb-2">Hosts</h3>
        <p className="text-gray-400">Configure event hosts</p>
      </div>
    </div>
  );
}

// Fonction pour valider les données de cette étape
export const validateHosts = (formData: any) => {
  const errors: Record<string, string> = {};
  // Ajouter la validation des hosts ici
  return errors;
};

// Fonction pour préparer les données à envoyer
export const prepareHostsData = (formData: any) => {
  return {
    // Ajouter les données des hosts ici
  };
};
