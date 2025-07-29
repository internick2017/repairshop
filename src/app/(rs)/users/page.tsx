import { Metadata } from "next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { UserManagement } from "./UserManagement";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'User Management',
}

export default async function UsersPage() {
    try {
        // Check if user is a manager
        const { getUser, getPermission } = getKindeServerSession();
        const [managerPermission, user] = await Promise.all([
            getPermission("manager"),
            getUser()
        ]);

        const isManager = managerPermission?.isGranted || false;

        // Redirect non-managers
        if (!isManager) {
            redirect("/tickets");
        }

        // Ensure user exists
        if (!user) {
            redirect("/login");
        }

        return (
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        User Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage users, permissions, and access to the repair shop system
                    </p>
                </div>

                {/* User Management Component */}
                <UserManagement currentUser={user} />
            </div>
        );

    } catch (error) {
        console.error('Error loading users page:', error);
        redirect("/tickets");
    }
} 