"use client";

import { Users, Plus } from "lucide-react";

interface TeamHeaderProps {
  onAddMember: () => void;
}

export default function TeamHeader({ onAddMember }: TeamHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Users className="w-8 h-8 text-green-main" />
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400">
            Manage your organization members and their roles
          </p>
        </div>
      </div>
      <button
        onClick={onAddMember}
        className="px-4 py-2 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-dark hover:to-green-main transition-all duration-200 flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Member</span>
      </button>
    </div>
  );
}
