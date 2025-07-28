"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

interface LiveUpdateStatusProps {
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  isPolling: boolean;
  onRefresh: () => void;
  showDetailedStatus?: boolean;
}

export const LiveUpdateStatus = React.memo<LiveUpdateStatusProps>(function LiveUpdateStatus({
  loading,
  error,
  lastUpdated,
  isPolling,
  onRefresh,
  showDetailedStatus = true
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Updating...' : 'Refresh'}
      </Button>
      
      {showDetailedStatus && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {/* Connection Status */}
          <div className="flex items-center gap-1">
            {isPolling ? (
              <Wifi className="w-3 h-3 text-green-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-500" />
            )}
            <span>{isPolling ? 'Connected' : 'Offline'}</span>
          </div>

          {/* Live Indicator */}
          {isPolling && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}

          {/* Error Indicator */}
          {error && (
            <div className="flex items-center gap-1 text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Error</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});