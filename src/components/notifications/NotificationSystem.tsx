'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Bell, 
    CheckCircle, 
    AlertTriangle, 
    Info, 
    X, 
    Clock,
    User,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Notification interface
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
    autoDismiss?: boolean;
    dismissAfter?: number; // milliseconds
}

// Notification context
interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
    unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook to use notifications
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

// Notification provider component
interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false,
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Auto dismiss if configured
        if (newNotification.autoDismiss && newNotification.dismissAfter) {
            setTimeout(() => {
                removeNotification(newNotification.id);
            }, newNotification.dismissAfter);
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                markAsRead,
                removeNotification,
                clearAll,
                unreadCount,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

// Notification bell component
interface NotificationBellProps {
    className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
    const { unreadCount, notifications } = useNotifications();

    return (
        <div className={cn("relative", className)}>
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </Button>
        </div>
    );
}

// Notification panel component
interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

export function NotificationPanel({ isOpen, onClose, className }: NotificationPanelProps) {
    const { notifications, markAsRead, removeNotification, clearAll, unreadCount } = useNotifications();

    if (!isOpen) return null;

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'error':
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getTypeColor = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
            case 'error':
                return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
            default:
                return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Panel */}
            <Card className={cn("w-96 max-h-[80vh] overflow-hidden", className)}>
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <Badge variant="secondary">{unreadCount}</Badge>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAll}
                                className="text-xs"
                            >
                                Clear All
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No notifications</p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-3 rounded-lg border transition-all duration-200",
                                        getTypeColor(notification.type),
                                        !notification.read && "ring-2 ring-blue-200 dark:ring-blue-800"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        {getIcon(notification.type)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                    {notification.title}
                                                </h4>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeNotification(notification.id);
                                                    }}
                                                    className="h-6 w-6 p-0 ml-2"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                </span>
                                                {notification.action && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            notification.action?.onClick();
                                                        }}
                                                        className="text-xs h-6"
                                                    >
                                                        {notification.action.label}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

// Utility function to format time
function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return options?.addSuffix ? 'just now' : 'less than a minute';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        const suffix = options?.addSuffix ? ' ago' : '';
        return `${diffInMinutes}m${suffix}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        const suffix = options?.addSuffix ? ' ago' : '';
        return `${diffInHours}h${suffix}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    const suffix = options?.addSuffix ? ' ago' : '';
    return `${diffInDays}d${suffix}`;
}

// Predefined notification helpers
export const notificationHelpers = {
    success: (title: string, message: string, options?: Partial<Notification>) => {
        return {
            type: 'success' as const,
            title,
            message,
            autoDismiss: true,
            dismissAfter: 5000,
            ...options,
        };
    },
    
    error: (title: string, message: string, options?: Partial<Notification>) => {
        return {
            type: 'error' as const,
            title,
            message,
            autoDismiss: false,
            ...options,
        };
    },
    
    warning: (title: string, message: string, options?: Partial<Notification>) => {
        return {
            type: 'warning' as const,
            title,
            message,
            autoDismiss: true,
            dismissAfter: 8000,
            ...options,
        };
    },
    
    info: (title: string, message: string, options?: Partial<Notification>) => {
        return {
            type: 'info' as const,
            title,
            message,
            autoDismiss: true,
            dismissAfter: 6000,
            ...options,
        };
    },
}; 