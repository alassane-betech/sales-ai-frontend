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

interface Lead {
  id: string;
  org_id: string;
  owner_id: string;
  booking_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  source: "scheduler" | "whatsapp" | "email_drip" | "manual";
  owner: { name: string; avatar: string };
  status: "new" | "contacted" | "qualified" | "unqualified" | "nurturing";
  lead_score: number;
  tags: string[];
  last_touchpoint: { date: string; channel: string } | null;
  next_action_due: string | null;
  interactions: Interaction[];
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: "1",
    org_id: "org1",
    owner_id: "user1",
    name: "John Smith",
    email: "john@company.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc",
    source: "scheduler",
    owner: { name: "Sarah Johnson", avatar: "/avatars/sarah.jpg" },
    status: "new",
    lead_score: 85,
    tags: ["enterprise", "decision-maker"],
    last_touchpoint: { date: "2024-01-15", channel: "scheduler" },
    next_action_due: "2024-01-20",
    interactions: [
      {
        id: "int1",
        type: "booking",
        date: "2024-01-15",
        details: {
          booking: { date: "2024-01-20 10:00 AM", link: "/booking/123" },
        },
      },
    ],
  },
  {
    id: "2",
    org_id: "org1",
    owner_id: "user2",
    name: "Maria Garcia",
    email: "maria@startup.com",
    phone: "+1 (555) 987-6543",
    company: "StartupXYZ",
    source: "whatsapp",
    owner: { name: "Mike Chen", avatar: "/avatars/mike.jpg" },
    status: "contacted",
    lead_score: 72,
    tags: ["startup", "technical"],
    last_touchpoint: { date: "2024-01-14", channel: "whatsapp" },
    next_action_due: "2024-01-18",
    interactions: [
      {
        id: "int2",
        type: "whatsapp",
        date: "2024-01-14",
        details: {
          whatsapp: { transcript: "Hi! I'm interested in your AI solution..." },
        },
      },
    ],
  },
  {
    id: "3",
    org_id: "org1",
    owner_id: "user1",
    name: "David Wilson",
    email: "david@enterprise.com",
    phone: "+1 (555) 456-7890",
    company: "Enterprise Solutions",
    source: "email_drip",
    owner: { name: "Sarah Johnson", avatar: "/avatars/sarah.jpg" },
    status: "qualified",
    lead_score: 95,
    tags: ["enterprise", "budget-approved"],
    last_touchpoint: { date: "2024-01-13", channel: "email" },
    next_action_due: "2024-01-16",
    interactions: [
      {
        id: "int3",
        type: "email",
        date: "2024-01-13",
        details: {
          email: { subject: "Product Demo Request", status: "opened" },
        },
      },
    ],
  },
];

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
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
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
        <div className="flex items-center justify-between">
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
      </div>

      {/* Content */}
      <div className="p-6">
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
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                          Next Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#9D9DA8] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-[#232327]">
                      {paginatedLeads.map((lead) => (
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
                                    {lead.name?.charAt(0) || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {lead.name}
                                </div>
                                <div className="text-sm text-[#9D9DA8]">
                                  {lead.company}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            {lead.company}
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            {lead.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            {lead.phone}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {(() => {
                                const config = sourceConfig[lead.source];
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
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-700">
                                    {lead.owner.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-white">
                                  {lead.owner.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {(() => {
                              const config = statusConfig[lead.status];
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
                            <RadialProgress score={lead.lead_score} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-white">
                              {lead.next_action_due ? (
                                <span>
                                  Follow-up •{" "}
                                  {new Date(
                                    lead.next_action_due
                                  ).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-[#9D9DA8]">
                                  No action due
                                </span>
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
                      ))}
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
                            {leadsByStatus[status as Lead["status"]]?.length ||
                              0}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <Reorder.Group
                          axis="y"
                          values={leadsByStatus[status as Lead["status"]] || []}
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
                          {(leadsByStatus[status as Lead["status"]] || []).map(
                            (lead) => (
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
                                      {lead.name}
                                    </h4>
                                    <p className="text-xs text-[#9D9DA8]">
                                      {lead.company}
                                    </p>
                                  </div>
                                  <RadialProgress score={lead.lead_score} />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-[#232327] flex items-center justify-center mr-2">
                                      <span className="text-xs font-medium text-white">
                                        {lead.owner.name.charAt(0)}
                                      </span>
                                    </div>
                                    <span className="text-xs text-[#9D9DA8]">
                                      {lead.owner.name}
                                    </span>
                                  </div>

                                  {lead.next_action_due && (
                                    <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">
                                      {new Date(
                                        lead.next_action_due
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </Reorder.Item>
                            )
                          )}
                        </Reorder.Group>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                    {selectedCard.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedCard.company}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      {selectedCard.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      {selectedCard.phone}
                    </div>
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
                    Interaction History
                  </h4>
                  <div className="space-y-3">
                    {selectedCard.interactions.map((interaction) => (
                      <div
                        key={interaction.id}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {interaction.type === "booking" && (
                              <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                            )}
                            {interaction.type === "whatsapp" && (
                              <MessageCircle className="w-4 h-4 text-green-500 mr-2" />
                            )}
                            {interaction.type === "call" && (
                              <Phone className="w-4 h-4 text-purple-500 mr-2" />
                            )}
                            {interaction.type === "email" && (
                              <Mail className="w-4 h-4 text-gray-500 mr-2" />
                            )}
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {interaction.type}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(interaction.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600">
                          {interaction.type === "booking" && (
                            <span>
                              Booked for {interaction.details.booking?.date}
                            </span>
                          )}
                          {interaction.type === "whatsapp" && (
                            <span>
                              {interaction.details.whatsapp?.transcript}
                            </span>
                          )}
                          {interaction.type === "call" && (
                            <span>
                              Call duration:{" "}
                              {interaction.details.call?.duration}
                            </span>
                          )}
                          {interaction.type === "email" && (
                            <span>
                              {interaction.details.email?.subject} -{" "}
                              {interaction.details.email?.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
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
