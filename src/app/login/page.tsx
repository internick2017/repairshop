import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { ShieldCheckIcon, WrenchIcon, UserCircleIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl">
              <WrenchIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Employee Portal
          </h1>
          <p className="text-gray-600 text-lg">
            Francisco Computer Repair Shop
          </p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 space-y-6">
          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-600">
              Sign in to access the repair management system
            </p>
          </div>
          
          {/* Security Features */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span>Secure authentication with Kinde</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <UserCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span>Employee-only access</span>
            </div>
          </div>
          
          {/* Login Button */}
          <LoginLink>
            <Button 
              size="lg" 
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
            >
              Sign in with Kinde
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </LoginLink>
          
          {/* Help Text */}
          <p className="text-center text-sm text-gray-500">
            Having trouble signing in?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Contact IT Support
            </a>
          </p>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
            ← Back to main site
          </Link>
        </div>
      </div>
    </main>
  );
}