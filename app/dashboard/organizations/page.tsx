"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Building2,
  Users,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react";
import { getUserOrganizations } from "@/lib/api/organizations";
import { Organization } from "@/lib/api/organizations";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    fetchOrganizations();
  }, [router, user, authLoading]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserOrganizations();
      setOrganizations(data);
    } catch (err) {
      setError("Erreur lors du chargement des organisations");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationClick = (orgId: string) => {
    router.push(`/dashboard/${orgId}`);
  };

  const handleCreateOrganization = () => {
    router.push("/create-organization");
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      owner: {
        label: "Propriétaire",
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      },
      admin: {
        label: "Administrateur",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      },
      closer: {
        label: "Membre",
        color: "bg-green-500/20 text-green-400 border-green-500/30",
      },
    };

    const config =
      roleConfig[role as keyof typeof roleConfig] || roleConfig.closer;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007953] mx-auto mb-4"></div>
          <p className="text-[#9D9DA8]">Chargement des organisations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Erreur</h1>
          <p className="text-[#9D9DA8] mb-4">{error}</p>
          <button
            onClick={fetchOrganizations}
            className="px-4 py-2 bg-[#007953] text-white rounded-lg hover:bg-[#00a86b] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023]">
      {/* Header */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Mes Organisations
              </h1>
              <p className="text-[#9D9DA8] text-lg">
                Sélectionnez une organisation pour accéder à son dashboard
              </p>
            </div>
            <button
              onClick={handleCreateOrganization}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#007953] to-[#00a86b] text-white rounded-lg hover:from-[#00a86b] hover:to-[#007953] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle Organisation</span>
            </button>
          </div>

          {/* Grille des organisations */}
          {organizations && organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {organizations.map((org, index) => (
                  <motion.div
                    key={org.organization_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleOrganizationClick(org.organization_id)}
                    className="bg-[#1E1E21] backdrop-blur-md border border-[#232327] rounded-xl p-6 cursor-pointer hover:bg-[#232327] hover:border-[#007953]/20 transition-all duration-200 group hover:scale-105"
                  >
                    {/* Header de la carte */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#007953] to-[#00a86b] rounded-lg flex items-center justify-center shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      {getRoleBadge(org.role)}
                    </div>

                    {/* Contenu principal */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#007953] transition-colors">
                        {org.organization_name}
                      </h3>
                    </div>

                    {/* Statistiques */}
                    <div className="flex items-center justify-between text-sm text-[#9D9DA8] mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{org.memberCount} membres</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(org.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>

                    {/* Indicateur de clic */}
                    <div className="flex items-center justify-between text-[#007953] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-sm font-medium">
                        Cliquer pour accéder
                      </span>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#1E1E21] rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-12 h-12 text-[#9D9DA8]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Aucune organisation
              </h3>
              <p className="text-[#9D9DA8] mb-6">
                Vous n'êtes membre d'aucune organisation pour le moment.
              </p>
              <button
                onClick={handleCreateOrganization}
                className="px-6 py-3 bg-gradient-to-r from-[#007953] to-[#00a86b] text-white rounded-lg hover:from-[#00a86b] hover:to-[#007953] transition-all duration-200"
              >
                Créer votre première organisation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
