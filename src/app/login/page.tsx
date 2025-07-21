import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "@/components/ui/button";


export default function Login() {
  return (
    <main className="h-dvh flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Repair Shop</h1>
        <p className="text-muted-foreground mb-6">Sign in to manage your repair tickets</p>
      </div>
      <Button size="lg" className="w-full max-w-xs">
        <LoginLink>Sign in with Kinde</LoginLink>
      </Button>
    </main>
  );
}