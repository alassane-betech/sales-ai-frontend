"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/auth");
      return;
    }

    // Rediriger vers la page des organisations
    router.replace("/dashboard/organizations");
  }, [router]);

  // Affichage de chargement pendant la redirection
  return (
    <div className="h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-main mx-auto mb-4"></div>
        <p className="text-gray-400">Redirection vers vos organisations...</p>
      </div>
    </div>
  );
}
