"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { NavigationSkeleton, BreadcrumbSkeleton } from "./NavigationSkeleton";
import { StatsGridSkeleton } from "./StatsSkeleton";
import { TableSkeleton } from "./TableRowSkeleton";
import { FormSkeleton } from "./FormFieldSkeleton";

interface PageSkeletonProps {
  type?: 'dashboard' | 'list' | 'form' | 'profile' | 'settings';
  showHeader?: boolean;
  showBreadcrumb?: boolean;
  showSidebar?: boolean;
  animated?: boolean;
  className?: string;
}

export function PageSkeleton({ 
  type = 'dashboard',
  showHeader = true,
  showBreadcrumb = true,
  showSidebar = false,
  animated = true,
  className 
}: PageSkeletonProps) {
  const renderContent = () => {
    switch (type) {
      case 'dashboard':
        return <DashboardContentSkeleton animated={animated} />;
      case 'list':
        return <ListContentSkeleton animated={animated} />;
      case 'form':
        return <FormContentSkeleton animated={animated} />;
      case 'profile':
        return <ProfileContentSkeleton animated={animated} />;
      case 'settings':
        return <SettingsContentSkeleton animated={animated} />;
      default:
        return <DashboardContentSkeleton animated={animated} />;
    }
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-950", className)}>
      {/* Header */}
      {showHeader && <NavigationSkeleton animated={animated} />}
      
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <div className="hidden lg:block">
            <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen">
              <div className="p-4 space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Skeleton className={cn("h-4 w-4", animated && "animate-pulse")} />
                    <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto p-6">
            {/* Breadcrumb */}
            {showBreadcrumb && (
              <BreadcrumbSkeleton animated={animated} className="mb-6" />
            )}
            
            {/* Page Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardContentSkeleton({ animated }: { animated: boolean }) {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <Skeleton className={cn("h-8 w-48", animated && "animate-pulse")} />
        <Skeleton className={cn("h-4 w-64", animated && "animate-pulse")} />
      </div>
      
      {/* Stats */}
      <StatsGridSkeleton count={4} cardProps={{ animated }} />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <Skeleton className={cn("h-6 w-32 mb-4", animated && "animate-pulse")} />
          <Skeleton className={cn("h-64 w-full", animated && "animate-pulse")} />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <Skeleton className={cn("h-6 w-32 mb-4", animated && "animate-pulse")} />
          <Skeleton className={cn("h-64 w-full", animated && "animate-pulse")} />
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <Skeleton className={cn("h-6 w-32 mb-4", animated && "animate-pulse")} />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center space-x-3">
                <Skeleton className={cn("h-8 w-8 rounded-full", animated && "animate-pulse")} />
                <div className="space-y-1">
                  <Skeleton className={cn("h-4 w-32", animated && "animate-pulse")} />
                  <Skeleton className={cn("h-3 w-24", animated && "animate-pulse")} />
                </div>
              </div>
              <Skeleton className={cn("h-4 w-16", animated && "animate-pulse")} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListContentSkeleton({ animated }: { animated: boolean }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className={cn("h-8 w-32", animated && "animate-pulse")} />
          <Skeleton className={cn("h-4 w-48", animated && "animate-pulse")} />
        </div>
        <Skeleton className={cn("h-10 w-32", animated && "animate-pulse")} />
      </div>
      
      {/* Filters/Search */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className={cn("h-10 flex-1", animated && "animate-pulse")} />
          <Skeleton className={cn("h-10 w-24", animated && "animate-pulse")} />
          <Skeleton className={cn("h-10 w-20", animated && "animate-pulse")} />
        </div>
      </div>
      
      {/* Table */}
      <TableSkeleton rows={8} animated={animated} />
    </div>
  );
}

function FormContentSkeleton({ animated }: { animated: boolean }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className={cn("h-8 w-48", animated && "animate-pulse")} />
          <Skeleton className={cn("h-4 w-64", animated && "animate-pulse")} />
        </div>
        <Skeleton className={cn("h-6 w-24", animated && "animate-pulse")} />
      </div>
      
      {/* Form */}
      <FormSkeleton sectionCount={3} sectionProps={{ animated }} />
    </div>
  );
}

function ProfileContentSkeleton({ animated }: { animated: boolean }) {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <Skeleton className={cn("h-32 w-full", animated && "animate-pulse")} />
        <div className="p-6">
          <div className="flex items-start space-x-4 -mt-16">
            <Skeleton className={cn("h-20 w-20 rounded-full border-4 border-white dark:border-gray-900", animated && "animate-pulse")} />
            <div className="flex-1 space-y-2 mt-12">
              <Skeleton className={cn("h-6 w-32", animated && "animate-pulse")} />
              <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
              <Skeleton className={cn("h-4 w-48", animated && "animate-pulse")} />
            </div>
            <div className="flex space-x-2 mt-12">
              <Skeleton className={cn("h-9 w-20", animated && "animate-pulse")} />
              <Skeleton className={cn("h-9 w-9", animated && "animate-pulse")} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <Skeleton className={cn("h-6 w-24 mb-4", animated && "animate-pulse")} />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className={cn("h-4 w-full", animated && "animate-pulse")} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <Skeleton className={cn("h-6 w-20 mb-4", animated && "animate-pulse")} />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Skeleton className={cn("h-4 w-16", animated && "animate-pulse")} />
                  <Skeleton className={cn("h-4 w-20", animated && "animate-pulse")} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsContentSkeleton({ animated }: { animated: boolean }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className={cn("h-8 w-32", animated && "animate-pulse")} />
        <Skeleton className={cn("h-4 w-48", animated && "animate-pulse")} />
      </div>
      
      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-3 rounded-lg">
              <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
            </div>
          ))}
        </div>
        
        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className={cn("h-6 w-32", animated && "animate-pulse")} />
                <Skeleton className={cn("h-4 w-48", animated && "animate-pulse")} />
              </div>
              
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className={cn("h-4 w-24", animated && "animate-pulse")} />
                    <Skeleton className={cn("h-10 w-full", animated && "animate-pulse")} />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Skeleton className={cn("h-10 w-20", animated && "animate-pulse")} />
                <Skeleton className={cn("h-10 w-16", animated && "animate-pulse")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}