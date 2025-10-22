import { SettingsCampaign } from "@/lib/api/settings-campaign";

interface Event {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EventRowProps {
  event: Event;
  campaign: SettingsCampaign | undefined;
  onCreateCampaign: (eventId: string) => void;
  onEditCampaign: (eventId: string) => void;
  onDeleteCampaign: (eventId: string) => void;
}

export default function EventRow({
  event,
  campaign,
  onCreateCampaign,
  onEditCampaign,
  onDeleteCampaign,
}: EventRowProps) {
  return (
    <div className="grid grid-cols-12 gap-4 bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
      {/* Event Name */}
      <div className="col-span-4 flex items-center">
        <span className="text-white font-medium">{event.name}</span>
      </div>

      {/* Campaign Name */}
      <div className="col-span-4 flex items-center">
        {campaign ? (
          <span className="text-gray-300">{campaign.name}</span>
        ) : (
          <span className="text-gray-500 italic">Aucune campagne</span>
        )}
      </div>

      {/* Status */}
      <div className="col-span-2 flex items-center">
        {campaign ? (
          <span className="text-green-400 text-sm">✓ Active</span>
        ) : (
          <span className="text-gray-500 text-sm">Inactive</span>
        )}
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end space-x-2">
        {campaign ? (
          <>
            <button
              onClick={() => onEditCampaign(event.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12l8-8-8-8"
                />
              </svg>
            </button>
            <button
              onClick={() => onDeleteCampaign(event.id)}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </>
        ) : (
          <button
            onClick={() => onCreateCampaign(event.id)}
            className="px-3 py-1 bg-green-main text-white text-sm rounded hover:bg-green-light transition-colors"
          >
            Créer campagne
          </button>
        )}
      </div>
    </div>
  );
}
