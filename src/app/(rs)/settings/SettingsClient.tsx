'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    User, 
    Shield, 
    Bell, 
    Palette, 
    Database, 
    Globe,
    Mail,
    Smartphone,
    Clock,
    Key,
    Info,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";

interface SettingsClientProps {
    user: any;
    isManager: boolean;
}

export function SettingsClient({ user, isManager }: SettingsClientProps) {
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        inApp: true
    });

    const userInfo = [
        { label: "Name", value: user?.given_name && user?.family_name ? `${user.given_name} ${user.family_name}` : "Not provided" },
        { label: "Email", value: user?.email || "Not provided" },
        { label: "Role", value: isManager ? "Manager" : "Technician" },
        { label: "Status", value: "Active" }
    ];

    const systemInfo = [
        { label: "Environment", value: process.env.NODE_ENV || "development" },
        { label: "Version", value: "1.0.0" },
        { label: "Database", value: "PostgreSQL (Neon)" },
        { label: "Authentication", value: "Kinde Auth" }
    ];

    const handleNotificationChange = (type: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your account preferences and system configuration.
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/dashboard">
                        Back to Dashboard
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Profile */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>User Profile</span>
                            </CardTitle>
                            <CardDescription>
                                Your account information and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userInfo.map((info, index) => (
                                    <div key={index} className="space-y-1">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {info.label}
                                        </label>
                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                            {info.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                        Account Actions
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Manage your account settings
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Edit Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Bell className="h-5 w-5" />
                                <span>Notifications</span>
                            </CardTitle>
                            <CardDescription>
                                Configure how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                Email Notifications
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Receive updates via email
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant={notifications.email ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleNotificationChange('email')}
                                    >
                                        {notifications.email ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Smartphone className="h-5 w-5 text-green-500" />
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                SMS Notifications
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Receive urgent alerts via SMS
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant={notifications.sms ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleNotificationChange('sms')}
                                    >
                                        {notifications.sms ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Bell className="h-5 w-5 text-purple-500" />
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                In-App Notifications
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Show notifications in the application
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant={notifications.inApp ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleNotificationChange('inApp')}
                                    >
                                        {notifications.inApp ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Palette className="h-5 w-5" />
                                <span>Appearance</span>
                            </CardTitle>
                            <CardDescription>
                                Customize the look and feel of the application
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Palette className="h-5 w-5 text-orange-500" />
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                            Theme
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Choose your preferred theme
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant={theme === 'light' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTheme('light')}
                                    >
                                        Light
                                    </Button>
                                    <Button
                                        variant={theme === 'dark' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTheme('dark')}
                                    >
                                        Dark
                                    </Button>
                                    <Button
                                        variant={theme === 'system' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTheme('system')}
                                    >
                                        System
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Manager Settings */}
                    {isManager && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5" />
                                    <span>System Configuration</span>
                                </CardTitle>
                                <CardDescription>
                                    Administrative settings and system configuration
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                                        <Database className="h-5 w-5 text-blue-500" />
                                        <div className="text-left">
                                            <h4 className="font-medium">Database</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Manage database settings
                                            </p>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                                        <Globe className="h-5 w-5 text-green-500" />
                                        <div className="text-left">
                                            <h4 className="font-medium">Integrations</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Configure external services
                                            </p>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                                        <Clock className="h-5 w-5 text-purple-500" />
                                        <div className="text-left">
                                            <h4 className="font-medium">Backup</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Schedule data backups
                                            </p>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2">
                                        <Key className="h-5 w-5 text-orange-500" />
                                        <div className="text-left">
                                            <h4 className="font-medium">API Keys</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Manage API access
                                            </p>
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* System Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Info className="h-5 w-5" />
                                <span>System Info</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {systemInfo.map((info, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {info.label}
                                    </span>
                                    <Badge variant="secondary" className="text-xs">
                                        {info.value}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/dashboard">
                                    <User className="h-4 w-4 mr-2" />
                                    View Dashboard
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/tickets">
                                    <Clock className="h-4 w-4 mr-2" />
                                    View Tickets
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link href="/customers">
                                    <User className="h-4 w-4 mr-2" />
                                    View Customers
                                </Link>
                            </Button>
                            {isManager && (
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href="/users">
                                        <Shield className="h-4 w-4 mr-2" />
                                        Manage Users
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Support */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5" />
                                <span>Support</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Need help? Contact our support team.
                            </p>
                            <Button variant="outline" className="w-full">
                                Contact Support
                            </Button>
                            <Button variant="outline" className="w-full">
                                View Documentation
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 