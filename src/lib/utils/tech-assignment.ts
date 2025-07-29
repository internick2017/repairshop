import { Users, init as kindeInit } from "@kinde/management-api-js";

// Type definitions for Kinde users
export interface KindeUser {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    is_suspended?: boolean;
}

export interface TechUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName: string;
    isActive: boolean;
}

// Initialize Kinde Management API
export async function initializeKindeAPI() {
    if (!process.env.KINDE_DOMAIN || !process.env.KINDE_MANAGEMENT_CLIENT_ID || !process.env.KINDE_MANAGEMENT_CLIENT_SECRET) {
        throw new Error('Missing Kinde environment variables');
    }

    const kindeDomain = process.env.KINDE_DOMAIN.startsWith('http') 
        ? process.env.KINDE_DOMAIN 
        : `https://${process.env.KINDE_DOMAIN}`;

    await kindeInit({
        kindeDomain: kindeDomain,
        clientId: process.env.KINDE_MANAGEMENT_CLIENT_ID,
        clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET,
    });
}

// Fetch all users from Kinde
export async function fetchKindeUsers(): Promise<TechUser[]> {
    try {
        await initializeKindeAPI();
        
        const usersResponse = await Users.getUsers();
        const users = usersResponse?.users || [];

        return users
            .filter((user: KindeUser) => user.id && user.email && user.is_suspended !== true)
            .map((user: KindeUser) => ({
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                fullName: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
                isActive: user.is_suspended === false,
            }));
    } catch (error) {
        console.error('Error fetching users from Kinde:', error);
        throw new Error('Failed to fetch users from Kinde');
    }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<TechUser | null> {
    try {
        const users = await fetchKindeUsers();
        return users.find(user => user.email === email) || null;
    } catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
}

// Get user by Kinde ID
export async function getUserById(kindeUserId: string): Promise<TechUser | null> {
    try {
        const users = await fetchKindeUsers();
        return users.find(user => user.id === kindeUserId) || null;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}

// Create tech options for form dropdowns
export function createTechOptions(users: TechUser[], includeUnassigned: boolean = true) {
    const options = includeUnassigned 
        ? [{ value: "unassigned", label: "Unassigned" }]
        : [];

    return [
        ...options,
        ...users.map(user => ({
            value: user.email,
            label: user.fullName,
            data: user // Include full user data for additional context
        }))
    ];
}

// Validate if a user can be assigned as a technician
export function canAssignAsTech(user: TechUser): boolean {
    return user.isActive && user.email && user.id;
}

// Get display name for a technician
export function getTechDisplayName(techEmail: string, users: TechUser[]): string {
    if (techEmail === "unassigned") {
        return "Unassigned";
    }
    
    const user = users.find(u => u.email === techEmail);
    return user ? user.fullName : techEmail;
}

// Get technician details for a ticket
export async function getTicketTechDetails(techEmail: string, kindeUserId?: string): Promise<{
    email: string;
    displayName: string;
    kindeUserId?: string;
    isActive: boolean;
} | null> {
    if (techEmail === "unassigned") {
        return {
            email: "unassigned",
            displayName: "Unassigned",
            isActive: false
        };
    }

    try {
        let user: TechUser | null = null;
        
        // Try to get user by Kinde ID first if available
        if (kindeUserId) {
            user = await getUserById(kindeUserId);
        }
        
        // Fallback to email lookup
        if (!user) {
            user = await getUserByEmail(techEmail);
        }

        if (!user) {
            return {
                email: techEmail,
                displayName: techEmail,
                isActive: false
            };
        }

        return {
            email: user.email,
            displayName: user.fullName,
            kindeUserId: user.id,
            isActive: user.isActive
        };
    } catch (error) {
        console.error('Error getting ticket tech details:', error);
        return {
            email: techEmail,
            displayName: techEmail,
            isActive: false
        };
    }
}