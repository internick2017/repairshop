"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
    href?: string;
    label?: string;
    className?: string;
}

export function BackButton({ 
    href, 
    label = "Back", 
    className = "" 
}: BackButtonProps) {
    const router = useRouter();

    // If no href is provided, use router.back()
    const handleClick = href 
        ? undefined 
        : (e: React.MouseEvent) => {
            e.preventDefault();
            router.back();
        };

    // If href is provided, render as Link, otherwise render as button
    if (href) {
        return (
            <Link 
                href={href} 
                className={`
                    inline-flex items-center gap-2 
                    text-gray-600 hover:text-gray-800 
                    dark:text-gray-300 dark:hover:text-gray-100 
                    transition-colors duration-200 
                    ${className}
                `}
            >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
            </Link>
        );
    }

    return (
        <button 
            type="button"
            onClick={handleClick}
            className={`
                inline-flex items-center gap-2 
                text-gray-600 hover:text-gray-800 
                dark:text-gray-300 dark:hover:text-gray-100 
                transition-colors duration-200 
                ${className}
            `}
        >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
} 