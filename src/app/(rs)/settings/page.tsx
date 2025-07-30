import { Metadata } from "next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";
import * as Sentry from "@sentry/nextjs";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Computer Repair Shop Settings - System Configuration and Preferences',
}

export default async function SettingsPage() {
    try {
        // Get user session and permissions
        const { getUser, getPermission } = getKindeServerSession();
        const [managerPermission, user] = await Promise.all([
            getPermission("manager"),
            getUser()
        ]);

        const isManager = managerPermission?.isGranted || false;
        
        // Ensure user exists
        if (!user) {
            redirect("/login");
        }

        return <SettingsClient user={user} isManager={isManager} />;
    } catch (error) {
        Sentry.captureException(error, {
            tags: { component: 'SettingsPage', action: 'load_settings' }
        });

        console.error('Settings Page Error:', error);

        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error Loading Settings
                    </h2>
                    <p className="text-red-700 dark:text-red-300">
                        Failed to load settings. Please try again later.
                    </p>
                </div>
            </div>
        );
    }
} 