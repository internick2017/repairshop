import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";


type NavButtonProps = {
    Icon: LucideIcon;
    href?: string;
    label: string;
}



export function NavButton({ Icon, href, label }: NavButtonProps) {
    const pathname = usePathname();
    const isActive = href && pathname === href;

    return (
        <Button 
            variant={isActive ? "default" : "ghost"}
            size="icon" 
            aria-label={label} 
            title={label} 
            asChild 
            className={`rounded-full group 
                hover:scale-110 
                transition-all 
                duration-300 
                ease-in-out 
                hover:rotate-6 
                focus:ring-2 
                focus:ring-primary/50 
                active:scale-95
                ${isActive ? 'bg-primary text-primary-foreground shadow-md' : ''}`}
        >
           {href ? (
            <Link href={href}>
                <Icon className={`w-4 h-4 transition-colors duration-300 ${
                    isActive ? 'text-primary-foreground' : 'group-hover:text-primary'
                }`} />
            </Link>
           ) : (
            <Icon className="w-4 h-4" />
           )}
        </Button>
    )
}