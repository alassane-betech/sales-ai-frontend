import { Bell } from "lucide-react";

interface NotificationsStepProps {}

export default function NotificationsStep({}: NotificationsStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-white mb-2">Notifications</h3>
        <p className="text-gray-400">Configure notification settings</p>
      </div>
    </div>
  );
}

// Fonction pour valider les données de cette étape
export const validateNotifications = (formData: any) => {
  const errors: Record<string, string> = {};
  // Ajouter la validation des notifications ici
  return errors;
};

// Fonction pour préparer les données à envoyer
export const prepareNotificationsData = (formData: any) => {
  return {
    // Ajouter les données des notifications ici
  };
};
