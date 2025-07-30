'use client'

import { File, User, Users, Moon, Sun, Bug, LogOut } from "lucide-react";
import Link from "next/link";
import { NavButton } from "./NavButton";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { NotificationBell } from "./notifications/NotificationSystem";

export function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { getPermission, isLoading } = useKindeBrowserClient();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const isManager = !isLoading && getPermission("manager")?.isGranted;

    return (
        <header 
            role="banner"
            className="animate-slide bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-all duration-300 ease-in-out shadow-lg group">
            <nav 
                role="navigation" 
                aria-label="Main navigation"
                className="flex items-center justify-between w-full px-8 py-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 ml-0 group"
                        title="Home"
                    >
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <File className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold hidden sm:block m-0 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 ease-in-out">
                            Computer Repair Shop
                        </h1>
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        aria-pressed={theme === 'dark'}
                    >
                        {!mounted ? (
                            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-all" />
                        ) : theme === 'dark' ? (
                            <Sun className="h-5 w-5 text-yellow-500 transition-all" />
                        ) : (
                            <Moon className="h-5 w-5 text-blue-600 transition-all" />
                        )}
                        <span className="sr-only">
                            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        </span>
                    </Button>
                    
                    <NotificationBell />
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-2 mx-4 rounded-xl shadow-sm">
                        <NavButton Icon={File} href="/tickets" label="Tickets" />
                        <NavButton Icon={User} href="/customers" label="Customers" />
                        {isManager && (
                            <NavButton Icon={Users} href="/users" label="Users" />
                        )}
                    </div>
                    
                    {process.env.NODE_ENV === 'development' && (
                        <NavButton Icon={Bug} href="/sentry-example-page" label="Sentry Test" />
                    )}

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        asChild
                        aria-label="Log out"
                        className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200"
                    >
                        <LogoutLink>
                            <LogOut className="h-5 w-5 transition-all" />
                            <span className="sr-only">Log out</span>
                        </LogoutLink>
                    </Button>
                </div>
            </nav>
        </header>
    );
}