'use client'

import { HomeIcon, File, User, Users, Moon, Sun, Bug, LogOut } from "lucide-react";
import Link from "next/link";
import { NavButton } from "./NavButton";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

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
        <header className="animate-slide bg-background border-b sticky top-0 z-50 
            transition-all duration-300 ease-in-out 
            hover:shadow-md 
            group">
            <div className="flex items-center justify-between w-full px-4 py-2">
                <div className="flex items-center gap-2">
                    <NavButton Icon={HomeIcon} href="/home" label="Home" />

                    <Link
                        href="/"
                        className="flex items-center gap-2 ml-0 group"
                        title="Home"
                    >
                        <h1 className="text-2xl font-bold hidden sm:block m-0 mt-1 
                            group-hover:text-primary 
                            transition-colors 
                            duration-300 
                            ease-in-out">
                            Computer Repair Shop
                        </h1>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="hover:bg-accent hover:text-accent-foreground"
                    >
                        {!mounted ? (
                            // Show a neutral icon during SSR to prevent hydration mismatch
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        ) : theme === 'dark' ? (
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        ) : (
                            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <NavButton Icon={File} href="/tickets" label="Tickets" />
                    <NavButton Icon={User} href="/customers" label="Customers" />
                    {isManager && (
                        <NavButton Icon={Users} href="/users" label="Users" />
                    )}
                    {process.env.NODE_ENV === 'development' && (
                        <NavButton Icon={Bug} href="/sentry-example-page" label="Sentry Test" />
                    )}

                    <Button variant="ghost" size="icon" asChild>
                        <LogoutLink>
                            <LogOut className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                        </LogoutLink>
                    </Button>
                </div>
            </div>
        </header>
    );
}