"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Building2 } from "lucide-react";
import { getUserOrganizations, Organization } from "@/lib/api/organizations";

interface OrganizationSelectorProps {
  currentOrganization: Organization;
}

export default function OrganizationSelector({
  currentOrganization,
}: OrganizationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const orgs = await getUserOrganizations();
        setOrganizations(orgs);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des organisations:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchOrganizations();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrganizationSelect = (organizationId: string) => {
    setIsOpen(false);
    router.push(`/dashboard/${organizationId}`);
  };

  const handleCreateOrganization = () => {
    setIsOpen(false);
    router.push("/create-organization");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-green-main to-green-light rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-green-main to-green-light bg-clip-text text-transparent flex-1 text-left">
          {currentOrganization.organization_name}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-white/10 rounded-lg shadow-xl z-50">
          <div className="p-3">
            <div className="mb-3">
              <button
                onClick={handleCreateOrganization}
                className="w-full flex items-center space-x-3 px-4 py-3 text-green-main hover:text-green-light hover:bg-white/5 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Créer une organisation</span>
              </button>
            </div>

            <div className="space-y-1">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-main mx-auto"></div>
                </div>
              ) : (
                organizations.map((org) => (
                  <button
                    key={org.organization_id}
                    onClick={() =>
                      handleOrganizationSelect(org.organization_id)
                    }
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      org.organization_id ===
                      currentOrganization.organization_id
                        ? "bg-green-main/20 text-green-main"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-main to-green-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {org.organization_name}
                      </div>
                      <div className="text-sm text-gray-400">{org.role}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
