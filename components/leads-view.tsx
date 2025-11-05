"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircle,
  Calendar,
  User,
  RefreshCw,
  MoreHorizontal,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Filter,
  Download,
  Plus,
} from "lucide-react";
import { getLeadsByEvent, getLeadsByOrganization, Lead } from "@/lib/api/leads";
import { getEventsByOrganization } from "@/lib/api/events";
import { useParams } from "next/navigation";

interface Interaction {
  id: string;
  type: "booking" | "whatsapp" | "call" | "email";
  date: string;
  details: {
    booking?: { date: string; link: string };
    whatsapp?: { transcript: string };
    call?: { duration: string; recording?: string };
    email?: { subject: string; status: "sent" | "opened" | "clicked" };
  };
}

interface Event {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description?: string;
  location_type: "phone" | "google_meet" | "zoom";
  created_by: string;
  confirmation_redirect_url?: string;
  internal_note?: string;
  max_days_ahead?: number;
  min_notice_minutes?: number;
  duration_minutes: number;
  slot_increment_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  new: { label: "New", color: "bg-blue-100 text-blue-800", icon: Star },
  contacted: {
    label: "Contacted",
    color: "bg-yellow-100 text-yellow-800",
    icon: Phone,
  },
  qualified: {
    label: "Qualified",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  unqualified: {
    label: "Unqualified",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  nurturing: {
    label: "Nurturing",
    color: "bg-purple-100 text-purple-800",
    icon: AlertCircle,
  },
};

const sourceConfig = {
  scheduler: { label: "Scheduler", icon: Calendar },
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  email_drip: { label: "Email Drip", icon: Mail },
  manual: { label: "Manual", icon: User },
};

export default function LeadsView() {
  const params = useParams();
  const organizationId = params.organizationId as string;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCard, setSelectedCard] = useState<Lead | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    if (!organizationId) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventsData = await getEventsByOrganization(organizationId);
        setEvents(eventsData);
      } catch (err) {
        console.error("Erreur lors de la récupération des événements:", err);
        setError("Erreur lors du chargement des événements");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [organizationId]);

  // Fetch leads when event is selected or organization changes
  useEffect(() => {
    if (!organizationId) return;

    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        let leadsData: Lead[];

        if (selectedEventId) {
          leadsData = await getLeadsByEvent(selectedEventId);
        } else {
          leadsData = await getLeadsByOrganization(organizationId);
        }

        setLeads(leadsData);
      } catch (err) {
        console.error("Erreur lors de la récupération des leads:", err);
        setError("Erreur lors du chargement des leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [organizationId, selectedEventId]);

  // Helper function to get full name
  const getLeadName = (lead: Lead) => {
    if (lead.nom && lead.prenom) return `${lead.prenom} ${lead.nom}`;
    if (lead.nom) return lead.nom;
    if (lead.prenom) return lead.prenom;
    return "N/A";
  };

  // Sorting function
  const sortLeads = (leads: Lead[]) => {
    if (!sortConfig) return leads;

    return [...leads].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Pagination
  const paginatedLeads = sortLeads(leads).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle row expansion
  const toggleRowExpansion = (leadId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedRows(newExpanded);
  };

  // Handle bulk selection
  const toggleSelectAll = () => {
    if (selectedLeads.size === paginatedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(paginatedLeads.map((lead) => lead.id)));
    }
  };

  // Handle individual selection
  const toggleSelectLead = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  // Handle sorting
  const handleSort = (key: keyof Lead) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Handle status change (for Kanban drag & drop)
  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  // Group leads by status for Kanban
  const leadsByStatus = leads.reduce((acc, lead) => {
    if (!acc[lead.status]) acc[lead.status] = [];
    acc[lead.status].push(lead);
    return acc;
  }, {} as Record<Lead["status"], Lead[]>);

  // Radial progress component
  const RadialProgress = ({ score }: { score: number }) => (
    <div className="relative w-8 h-8">
      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 14}`}
          strokeDashoffset={`${2 * Math.PI * 14 * (1 - score / 100)}`}
          className="text-green-500 transition-all duration-300"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {score}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023]">
      {/* Header */}
      <div className="bg-[#1E1E21] backdrop-blur-md border-b border-[#232327] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Leads</h1>
            <p className="text-[#9D9DA8]">Manage and track your sales leads</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#232327] backdrop-blur-md rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-[#007953] text-white shadow-sm"
                    : "text-[#9D9DA8] hover:text-white"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "kanban"
                    ? "bg-[#007953] text-white shadow-sm"
                    : "text-[#9D9DA8] hover:text-white"
                }`}
              >
                Kanban
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-[#9D9DA8] bg-[#1E1E21] backdrop-blur-md border border-[#232327] rounded-lg hover:bg-[#232327] transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="px-4 py-2 text-sm font-medium text-[#9D9DA8] bg-[#1E1E21] backdrop-blur-md border border-[#232327] rounded-lg hover:bg-[#232327] transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#007953] to-[#00a86b] rounded-lg hover:from-[#00a86b] hover:to-[#007953] transition-all duration-300 shadow-lg hover:shadow-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </button>
            </div>
          </div>
        </div>

        {/* Event Selector */}
        <div className="flex items-center space-x-4 mt-4">
          <label className="text-sm font-medium text-[#9D9DA8]">
            Filter by Event:
          </label>
          <select
            value={selectedEventId || ""}
            onChange={(e) => setSelectedEventId(e.target.value || null)}
            className="bg-[#232327] border border-[#232327] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#007953] focus:border-transparent"
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
          {loading && (
            <RefreshCw className="w-4 h-4 text-[#9D9DA8] animate-spin" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-[#9D9DA8] animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-[#9D9DA8] mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              No leads found
            </h3>
            <p className="text-[#9D9DA8]">
              {selectedEventId
                ? "No leads found for this event."
                : "No leads found for this organization."}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "table" ? (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Table */}
                <div className="bg-[#1E1E21] backdrop-blur-md rounded-lg shadow-lg border border-[#232327] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#232327] border-b border-[#232327]">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={
                                selectedLeads.size === paginatedLeads.length &&
                                paginatedLeads.length > 0
                              }
                              onChange={toggleSelectAll}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Source
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Last Updated
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-transparent divide-y divide-[#232327]">
                        {loading && paginatedLeads.length === 0 ? (
                          <tr>
                            <td colSpan={11} className="px-6 py-8 text-center">
                              <RefreshCw className="w-6 h-6 text-[#9D9DA8] animate-spin mx-auto" />
                            </td>
                          </tr>
                        ) : (
                          paginatedLeads.map((lead) => (
                            <motion.tr
                              key={lead.id}
                              className="hover:bg-[#232327] transition-colors cursor-pointer"
                              onClick={() => toggleRowExpansion(lead.id)}
                            >
                              <td
                                className="px-6 py-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedLeads.has(lead.id)}
                                  onChange={() => toggleSelectLead(lead.id)}
                                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                      <span className="text-sm font-medium text-gray-700">
                                        {getLeadName(lead).charAt(0)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">
                                      {getLeadName(lead)}
                                    </div>
                                    <div className="text-sm text-[#9D9DA8]">
                                      {lead.company || "—"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-white">
                                {lead.company || "—"}
                              </td>
                              <td className="px-6 py-4 text-sm text-white">
                                {lead.email || "—"}
                              </td>
                              <td className="px-6 py-4 text-sm text-white">
                                {lead.phone || "—"}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  {(() => {
                                    const config = sourceConfig[lead.source];
                                    if (!config) {
                                      return (
                                        <span className="text-sm text-white">
                                          {lead.source || "unknown"}
                                        </span>
                                      );
                                    }
                                    const Icon = config.icon;
                                    return (
                                      <>
                                        <Icon className="w-4 h-4 text-[#9D9DA8] mr-2" />
                                        <span className="text-sm text-white">
                                          {config.label}
                                        </span>
                                      </>
                                    );
                                  })()}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <span className="text-sm text-white">
                                    {lead.event?.name || "—"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {(() => {
                                  const config = statusConfig[lead.status];
                                  if (!config) {
                                    return (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {lead.status || "unknown"}
                                      </span>
                                    );
                                  }
                                  const Icon = config.icon;
                                  return (
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
                                    >
                                      <Icon className="w-3 h-3 mr-1" />
                                      {config.label}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4">
                                <RadialProgress score={lead.score || 0} />
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-white">
                                  {lead.updated_at ? (
                                    <span>
                                      Updated •{" "}
                                      {new Date(
                                        lead.updated_at
                                      ).toLocaleDateString()}
                                    </span>
                                  ) : (
                                    <span className="text-[#9D9DA8]">—</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <button className="p-1 text-[#9D9DA8] hover:text-white transition-colors">
                                    <Mail className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 text-[#9D9DA8] hover:text-white transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 text-[#9D9DA8] hover:text-white transition-colors">
                                    <Calendar className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 text-[#9D9DA8] hover:text-white transition-colors">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="bg-[#232327] backdrop-blur-md px-6 py-3 border-t border-[#232327]">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[#9D9DA8]">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, leads.length)} of{" "}
                        {leads.length} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm text-[#9D9DA8] bg-[#1E1E21] backdrop-blur-md border border-[#232327] rounded-md hover:bg-[#232327] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          disabled={currentPage * itemsPerPage >= leads.length}
                          className="px-3 py-1 text-sm text-[#9D9DA8] bg-[#1E1E21] backdrop-blur-md border border-[#232327] rounded-md hover:bg-[#232327] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Kanban Board */}
                <div className="flex space-x-6 overflow-x-auto pb-4">
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <div key={status} className="flex-shrink-0 w-80">
                      <div className="bg-[#1E1E21] backdrop-blur-md rounded-lg shadow-lg border border-[#232327]">
                        <div className="px-4 py-3 border-b border-[#232327]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <config.icon className="w-4 h-4 mr-2 text-[#9D9DA8]" />
                              <h3 className="text-sm font-medium text-white">
                                {config.label}
                              </h3>
                            </div>
                            <span className="text-sm text-[#9D9DA8]">
                              {leadsByStatus[status as Lead["status"]]
                                ?.length || 0}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <Reorder.Group
                            axis="y"
                            values={
                              leadsByStatus[status as Lead["status"]] || []
                            }
                            onReorder={(newOrder) => {
                              // Handle reordering within the same status
                              setLeads((prev) => {
                                const otherLeads = prev.filter(
                                  (lead) => lead.status !== status
                                );
                                return [...otherLeads, ...newOrder];
                              });
                            }}
                            className="space-y-3"
                          >
                            {(
                              leadsByStatus[status as Lead["status"]] || []
                            ).map((lead) => (
                              <Reorder.Item
                                key={lead.id}
                                value={lead}
                                className="bg-[#232327] backdrop-blur-md rounded-lg p-4 cursor-pointer hover:bg-[#007953]/20 hover:shadow-lg transition-all duration-200"
                                onClick={() => {
                                  setSelectedCard(lead);
                                  setShowDrawer(true);
                                }}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="text-sm font-medium text-white">
                                      {getLeadName(lead)}
                                    </h4>
                                    <p className="text-xs text-[#9D9DA8]">
                                      {lead.company || "—"}
                                    </p>
                                  </div>
                                  <RadialProgress score={lead.score || 0} />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="text-xs text-[#9D9DA8]">
                                      {lead.event?.name || "—"}
                                    </span>
                                  </div>

                                  {lead.updated_at && (
                                    <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">
                                      {new Date(
                                        lead.updated_at
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Interaction History Drawer */}
      <AnimatePresence>
        {showDrawer && selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowDrawer(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Lead Details
                  </h2>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Lead Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {getLeadName(selectedCard)}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCard.company || "—"}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      {selectedCard.email || "—"}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      {selectedCard.phone || "—"}
                    </div>
                    {selectedCard.event && (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {selectedCard.event.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Call
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      <User className="w-4 h-4 mr-2" />
                      Reassign
                    </button>
                  </div>
                </div>

                {/* Interaction History */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Lead Details
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Status:</strong> {selectedCard.status}
                        </p>
                        <p>
                          <strong>Source:</strong> {selectedCard.source}
                        </p>
                        {selectedCard.score && (
                          <p>
                            <strong>Score:</strong> {selectedCard.score}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}