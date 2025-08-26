"use client";

interface TeamSummaryProps {
  filteredCount: number;
  totalCount: number;
  superAdminCount: number;
  closerCount: number;
  availableCount: number;
}

export default function TeamSummary({
  filteredCount,
  totalCount,
  superAdminCount,
  closerCount,
  availableCount,
}: TeamSummaryProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          Showing {filteredCount} of {totalCount} members
        </span>
        <div className="flex items-center space-x-4">
          <span>Super Admins: {superAdminCount}</span>
          <span>Closers: {closerCount}</span>
          <span>Available: {availableCount}</span>
        </div>
      </div>
    </div>
  );
}
