"use client";

import { useEffect, useState } from "react";
import { getEventsByOrganization } from "@/lib/api/events";
import {
  SettingsCampaign,
  createCampaign,
  updateCampaign,
  CreateCampaignData,
  UpdateCampaignData,
} from "@/lib/api/settings-campaign";
import { Organization } from "@/lib/api/organizations";
import { EventRow, CampaignForm } from "./ai-settings";

interface AISettingsViewProps {
  organization: Organization;
}

interface Event {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  settings_campaign?: SettingsCampaign;
}

export default function AISettingsView({ organization }: AISettingsViewProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingCampaignFor, setCreatingCampaignFor] = useState<string | null>(
    null
  );
  const [editingCampaignFor, setEditingCampaignFor] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchEvents();
  }, [organization.organization_id]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEventsByOrganization(organization.organization_id);
      console.log("Events data received:", data);
      setEvents(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des événements:", err);
      setError("Erreur lors du chargement des événements");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = (eventId: string) => {
    setCreatingCampaignFor(eventId);
  };

  const handleSaveCampaign = async (
    data: CreateCampaignData | UpdateCampaignData
  ) => {
    try {
      if (editingCampaignFor) {
        // Édition
        const event = events.find((e) => e.id === editingCampaignFor);
        if (event?.settings_campaign) {
          const updatedCampaign = await updateCampaign(
            event.settings_campaign.id,
            data as UpdateCampaignData
          );
          setEvents(
            events.map((e) =>
              e.id === editingCampaignFor
                ? { ...e, settings_campaign: updatedCampaign }
                : e
            )
          );
          setEditingCampaignFor(null);
        }
      } else {
        // Création
        const newCampaign = await createCampaign(data as CreateCampaignData);
        setEvents(
          events.map((e) =>
            e.id === creatingCampaignFor
              ? { ...e, settings_campaign: newCampaign }
              : e
          )
        );
        setCreatingCampaignFor(null);
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde de la campagne:", err);
      setError("Erreur lors de la sauvegarde de la campagne");
    }
  };

  const handleCancelCampaign = () => {
    setCreatingCampaignFor(null);
    setEditingCampaignFor(null);
  };

  const handleEditCampaign = (eventId: string) => {
    setEditingCampaignFor(eventId);
  };

  const handleDeleteCampaign = (eventId: string) => {
    console.log("Suppression de campagne pour l'événement:", eventId);
  };

  return (
    <div className="h-full pt-10 px-6">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-main mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des événements...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-2">Erreur</h1>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 bg-green-main text-white rounded-lg hover:bg-green-light transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">
              AI Strategies
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Aucun événement trouvé pour cette organisation
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">AI Strategies</h1>

          {/* Header */}
          <div className="grid grid-cols-12 gap-4 mb-4 px-4 py-3 text-gray-400 text-sm font-medium">
            <div className="col-span-4">Event Name</div>
            <div className="col-span-4">Campaign Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          {/* Events List */}
          <div className="space-y-2">
            {events.map((event) => {
              return (
                <div key={event.id}>
                  <EventRow
                    event={event}
                    campaign={event.settings_campaign}
                    onCreateCampaign={handleCreateCampaign}
                    onEditCampaign={handleEditCampaign}
                    onDeleteCampaign={handleDeleteCampaign}
                  />

                  {/* Campaign Form */}
                  {(creatingCampaignFor === event.id ||
                    editingCampaignFor === event.id) && (
                    <CampaignForm
                      eventId={event.id}
                      eventName={event.name}
                      campaign={
                        editingCampaignFor === event.id
                          ? event.settings_campaign
                          : undefined
                      }
                      onSave={handleSaveCampaign}
                      onCancel={handleCancelCampaign}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
