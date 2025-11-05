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
} from "lucide-react";
import LeadsView from "@/components/leads-view";
import OverviewView from "@/components/overview-view";
import CalendarView from "@/components/dashboard/calendar-view/calendar-view";
import MeetingsView from "@/components/meetings-view";
import TeamView from "@/components/dashboard/team/team-view";
import AISettingsView from "@/components/dashboard/ai-settings-view";
import { getOrganizationById, Organization } from "@/lib/api/organizations";
import OrganizationSelector from "@/components/organization-selector";
import AvailibilityView from "./Tabs/Availibility/AvailibilityView";

// Component to render the correct tab view based on activeTab
const TabContent = ({
  activeTab,
  organizationId,
  organization,
  userId,
}: {
  activeTab: string;
  organizationId: string;
  organization: Organization;
  userId: string;
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
    case "availability":
      return <AvailibilityView organizationId={organizationId} userId={userId} />;
    case "ai-settings":
      return <AISettingsView organization={organization} />;
    default:
      return <OverviewView />;
  }
};

const navigationItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "leads", label: "Leads", icon: Users },
  { id: "availability", label: "Availability", icon: Calendar },
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
      <div className="h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007953] mx-auto mb-4"></div>
          <p className="text-[#9D9DA8]">Chargement de l'organisation...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Organisation non trouvée
          </h1>
          <p className="text-[#9D9DA8] mb-4">
            Cette organisation n'existe pas ou vous n'y avez pas accès.
          </p>
          <button
            onClick={() => router.push("/dashboard/organizations")}
            className="px-4 py-2 bg-[#007953] text-white rounded-lg hover:bg-[#00a86b] transition-colors"
          >
            Retour aux organisations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023] flex overflow-hidden">
      {/* Sidebar - Fixed height, always visible */}
      <div className="w-80 bg-[#1E1E21] backdrop-blur-md border-r border-[#232327] flex flex-col h-screen">
        {/* Header avec info de l'organisation */}
        <div className="p-6 border-b border-[#232327]">
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
                      ? "bg-gradient-to-r from-[#007953]/20 to-[#00a86b]/20 border border-[#007953]/30 text-[#007953]"
                      : "text-[#9D9DA8] hover:text-white hover:bg-[#232327]"
                  }`}
                >
                  {/* Active indicator bar */}
                  <div
                    className={`w-1 h-8 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-[#007953]"
                        : "bg-transparent group-hover:bg-[#232327]"
                    }`}
                  />

                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-[#007953]" : "text-[#9D9DA8]"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-[#232327]">
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
            <TabContent
              activeTab={activeTab}
              organizationId={organizationId}
              organization={organization}
              userId={user?.id || ""}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
