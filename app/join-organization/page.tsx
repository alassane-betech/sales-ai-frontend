"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { acceptInvitation } from "@/lib/api/invitations";

export default function JoinOrganizationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleInvitation = async () => {
      const token = searchParams.get("token");
      setHasToken(!!token);

      if (token) {
        try {
          const data = await acceptInvitation(token);
          // Rediriger vers le dashboard de l'organisation
          router.push(`/dashboard/${data.organization_id}`);
        } catch (error: any) {
          if (error.response?.status === 401) {
            setError("Token invalide ou expiré");
          } else if (error.response?.status === 403) {
            setError("L'email ne correspond pas à l'invitation");
          } else if (error.response?.status === 409) {
            setError("Invitation déjà acceptée ou expirée");
          } else {
            setError("Une erreur est survenue lors de l'acceptation");
          }
        }
      }
    };

    handleInvitation();
  }, [searchParams, router]);

  if (!hasToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Aucune invitation</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-main mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}
