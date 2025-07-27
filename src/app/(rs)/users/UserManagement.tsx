"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputWithLabel, CheckboxWithLabel } from "@/components/inputs";
import { Edit, Trash2, UserPlus, Save, X } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// User type definition
type User = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName: string;
    isActive: boolean;
    isSuspended?: boolean;
};

// Form schemas
const userFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    isActive: z.boolean(),
});



interface UserManagementProps {
    currentUser: {
        id?: string;
        email: string | null;
        given_name?: string | null;
        family_name?: string | null;
    };
}

export function UserManagement({ currentUser }: UserManagementProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Form setup
    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            isActive: true,
        },
    });

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            
            const response = await fetch('/api/users');
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.users);
            } else {
                toast.error(data.error || "Failed to fetch users");
            }
        } catch (_error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    // Load users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);



    // Handle form submission
    const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
        try {
            setActionLoading(true);
            
            if (editingUser) {
                // Update existing user
                const response = await fetch(`/api/users/${editingUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Immediately update the local state with the updated user data
                    setUsers(prevUsers => 
                        prevUsers.map(user => 
                            user.id === editingUser.id 
                                ? {
                                    ...user,
                                    email: result.user.email,
                                    firstName: result.user.firstName,
                                    lastName: result.user.lastName,
                                    fullName: result.user.fullName,
                                    isActive: result.user.isActive
                                  }
                                : user
                        )
                    );
                    
                    setShowAddForm(false);
                    setEditingUser(null);
                    form.reset();
                    toast.success("User updated successfully!");
                    
                    // Also fetch fresh data from server to ensure consistency
                    // Add a small delay to allow Kinde API to reflect changes
                    setTimeout(() => {
                        fetchUsers();
                    }, 1000);
                } else {
                    toast.error(result.error || "Failed to update user");
                }
            } else {
                // Create new user
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                
                const result = await response.json();
                if (result.success) {
                    setShowAddForm(false);
                    form.reset();
                    toast.success("User created successfully!");
                    fetchUsers();
                } else {
                    toast.error(result.error || "Failed to create user");
                }
            }
        } catch (_error) {
            toast.error("An error occurred while saving the user");
        } finally {
            setActionLoading(false);
        }
    };

    // Handle user deletion
    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        try {
            setActionLoading(true);
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            if (result.success) {
                toast.success("User deleted successfully!");
                fetchUsers();
            } else {
                toast.error(result.error || "Failed to delete user");
            }
        } catch (_error) {
            toast.error("An error occurred while deleting the user");
        } finally {
            setActionLoading(false);
        }
    };

    // Handle edit user
    const handleEditUser = (user: User) => {
        setEditingUser(user);
        form.reset({
            email: user.email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            isActive: user.isActive,
        });
        setShowAddForm(true);
    };

    // Handle cancel
    const handleCancel = () => {
        setShowAddForm(false);
        setEditingUser(null);
        form.reset();
    };

    // Handle toggle user status
    const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            setActionLoading(true);
            const response = await fetch(`/api/users/${userId}/toggle-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            
            const result = await response.json();
            if (result.success) {
                toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
                fetchUsers();
            } else {
                toast.error(result.error || "Failed to update user status");
            }
        } catch (_error) {
            toast.error("An error occurred while updating user status");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading users...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">


            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {showAddForm ? (editingUser ? "Edit User" : "Add New User") : "Users"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {users.length} user{users.length !== 1 ? 's' : ''} in the system
                    </p>
                </div>
                
                {!showAddForm && (
                    <Button 
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={actionLoading}
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    {editingUser && !editingUser.firstName && !editingUser.lastName && (
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                <strong>Note:</strong> This user doesn&apos;t have a name set. Please add their first and last name.
                            </p>
                        </div>
                    )}
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputWithLabel
                                    fieldTitle="Email"
                                    nameInSchema="email"
                                    required={true}
                                    type="email"
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputWithLabel
                                    fieldTitle="First Name"
                                    nameInSchema="firstName"
                                    required={true}
                                    placeholder="John"
                                />
                                
                                <InputWithLabel
                                    fieldTitle="Last Name"
                                    nameInSchema="lastName"
                                    required={true}
                                    placeholder="Doe"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CheckboxWithLabel
                                    fieldTitle="Active User"
                                    nameInSchema="isActive"
                                    required={false}
                                    description="User can access the system"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={actionLoading}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={actionLoading}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {actionLoading ? "Saving..." : (editingUser ? "Update User" : "Create User")}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}

            {/* Users List */}
            {!showAddForm && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                                 {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.firstName && user.lastName 
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : user.email
                                                    }
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </div>
                                                {!user.firstName && !user.lastName && (
                                                    <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                        Name not set
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.isActive 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                                            }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditUser(user)}
                                                    disabled={actionLoading}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                                                    disabled={actionLoading}
                                                >
                                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={actionLoading || Boolean(currentUser.email && user.email === currentUser.email)}
                                                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
} 