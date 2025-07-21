import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";


type NavButtonProps = {
    Icon: LucideIcon;
    href?: string;
    label: string;
}



export function NavButton({ Icon, href, label }: NavButtonProps) {
    return (
        <Button 
            variant="ghost" 
            size="icon" 
            aria-label={label} 
            title={label} 
            asChild 
            className="rounded-full group 
                hover:scale-110 
                transition-all 
                duration-300 
                ease-in-out 
                hover:rotate-6 
                focus:ring-2 
                focus:ring-primary/50 
                active:scale-95"
        >
           {href ? (
            <Link href={href}>
                <Icon className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
            </Link>
           ) : (
            <Icon className="w-4 h-4" />
           )}
        </Button>
    )
}