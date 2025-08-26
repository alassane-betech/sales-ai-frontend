"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Info, MoreVertical, Edit, Trash2 } from "lucide-react";
import AddMemberModal from "./add-member-modal";
import TeamHeader from "./team-header";
import TeamSummary from "./team-summary";
import { getOrganizationMembers, TeamMember } from "@/lib/api/organizations";

// Types
interface TeamViewProps {
  organizationId: string;
}

// Utility functions
const getRoleColor = (role: TeamMember["role"]) => {
  switch (role) {
    case "owner":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "admin":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "closer":
      return "bg-green-500/20 text-green-300 border-green-500/30";
  }
};

const getAvailabilityColor = () => {
  return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
};

const getRoleLabel = (role: TeamMember["role"]) => {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "closer":
      return "Closer";
  }
};

// Components
const Avatar = ({ initials, name }: { initials: string; name: string }) => (
  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
    {initials}
  </div>
);

const RoleBadge = ({ role }: { role: TeamMember["role"] }) => (
  <div
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
      role
    )}`}
  >
    {getRoleLabel(role)}
  </div>
);

const AvailabilityBadge = () => (
  <div
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor()}`}
  >
    Pas encore défini
  </div>
);

// Main component
export default function TeamView({ organizationId }: TeamViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] =
    useState<string>("all");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await getOrganizationMembers(organizationId);
        setTeamMembers(data);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [organizationId]);

  const filteredMembers = teamMembers.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    const matchesAvailability = selectedAvailability === "all";

    return matchesSearch && matchesRole && matchesAvailability;
  });

  const openAddMemberModal = () => {
    setIsAddMemberModalOpen(true);
  };

  const closeAddMemberModal = () => {
    setIsAddMemberModalOpen(false);
  };

  // Calculate summary data
  const ownerCount = teamMembers.filter((m) => m.role === "owner").length;
  const adminCount = teamMembers.filter((m) => m.role === "admin").length;
  const closerCount = teamMembers.filter((m) => m.role === "closer").length;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-main"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <TeamHeader onAddMember={openAddMemberModal} />

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-main appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="closer">Closer</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-main appearance-none"
            >
              <option value="all">All Availability</option>
              <option value="Pas encore défini">Pas encore défini</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  NOM ET PRÉNOM
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  E-MAIL
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  <div className="flex items-center space-x-2">
                    <span>RÔLE</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  <div className="flex items-center space-x-2">
                    <span>DISPONIBILITÉ</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMembers.map((member, index) => (
                <motion.tr
                  key={member.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        initials={`${member.first_name.charAt(
                          0
                        )}${member.last_name.charAt(0)}`}
                        name={`${member.first_name} ${member.last_name}`}
                      />
                      <span className="text-white font-medium">
                        {member.first_name} {member.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{member.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="px-6 py-4">
                    <AvailabilityBadge />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-lg">👥</span>
            </div>
            <p className="text-gray-400 text-lg">No members found</p>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <TeamSummary
        filteredCount={filteredMembers.length}
        totalCount={teamMembers.length}
        superAdminCount={ownerCount}
        closerCount={closerCount}
        availableCount={0}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={closeAddMemberModal}
        organizationId={organizationId}
      />
    </div>
  );
}
