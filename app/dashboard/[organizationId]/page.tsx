"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Video,
  UserCheck,
  LogOut,
  Building2,
} from "lucide-react";
import LeadsView from "@/components/leads-view";
import OverviewView from "@/components/overview-view";
import CalendarView from "@/components/calendar-view";
import MeetingsView from "@/components/meetings-view";
import TeamView from "@/components/dashboard/team/team-view";
import { getOrganizationById, Organization } from "@/lib/api/organizations";
import OrganizationSelector from "@/components/organization-selector";

// Component to render the correct tab view based on activeTab
const TabContent = ({
  activeTab,
  organizationId,
}: {
  activeTab: string;
  organizationId: string;
}) => {
  switch (activeTab) {
    case "overview":
      return <OverviewView />;
    case "calendar":
      return <CalendarView />;
    case "leads":
      return <LeadsView />;
    case "meetings":
      return <MeetingsView />;
    case "team":
      return <TeamView organizationId={organizationId} />;
    case "ai-settings":
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">
              {navigationItems.find((item) => item.id === activeTab)?.label}
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome to your{" "}
              {navigationItems
                .find((item) => item.id === activeTab)
                ?.label.toLowerCase()}{" "}
              dashboard
            </p>
          </div>
        </div>
      );
    default:
      return <OverviewView />;
  }
};

const navigationItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "leads", label: "Leads", icon: Users },
  { id: "ai-settings", label: "AI Settings", icon: Settings },
  { id: "meetings", label: "Meetings", icon: Video },
  { id: "team", label: "Team", icon: UserCheck },
];

export default function OrganizationDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const organizationId = params.organizationId as string;
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    if (organizationId) {
      fetchOrganization();
    }
  }, [router, organizationId, user, authLoading]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const data = await getOrganizationById(organizationId);
      setOrganization(data);
    } catch (err) {
      console.error("Erreur:", err);
      router.replace("/dashboard/organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-main mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de l'organisation...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Organisation non trouvée
          </h1>
          <p className="text-gray-400 mb-4">
            Cette organisation n'existe pas ou vous n'y avez pas accès.
          </p>
          <button
            onClick={() => router.push("/dashboard/organizations")}
            className="px-4 py-2 bg-green-main text-white rounded-lg hover:bg-green-light transition-colors"
          >
            Retour aux organisations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex overflow-hidden">
      {/* Sidebar - Fixed height, always visible */}
      <div className="w-80 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col h-screen">
        {/* Header avec info de l'organisation */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <OrganizationSelector currentOrganization={organization} />
          </div>
        </div>

        {/* Navigation - Fixed height */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group ${
                    isActive
                      ? "bg-gradient-to-r from-green-main/20 to-green-light/20 border border-green-main/30 text-green-main"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {/* Active indicator bar */}
                  <div
                    className={`w-1 h-8 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-green-main"
                        : "bg-transparent group-hover:bg-white/20"
                    }`}
                  />

                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-green-main" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <div className="w-1 h-8 rounded-full bg-transparent group-hover:bg-red-500/20 transition-all duration-200" />
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabContent activeTab={activeTab} organizationId={organizationId} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
