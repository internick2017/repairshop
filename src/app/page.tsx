import { Button } from "@/components/ui/button";
import { PhoneIcon, ClockIcon, MapPinIcon, WrenchIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <main className="bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-10 md:p-16 max-w-2xl w-full relative">
        <div className="space-y-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <WrenchIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight text-center">
            Francisco Computer <br /> Repair Shop
          </h1>
          
          {/* Tagline */}
          <p className="text-xl text-gray-600 text-center font-light">
            Professional Computer Repair & IT Solutions
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-3 gap-4 my-8">
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Certified Experts</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
              <ZapIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Fast Service</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-100">
              <ClockIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">24/7 Support</p>
            </div>
          </div>
          
          {/* Address Section */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 text-gray-500 mt-0.5" />
              <address className="not-italic text-gray-700 space-y-1">
                <p className="font-semibold">123 Main St</p>
                <p className="text-gray-600">Anytown, USA 12345</p>
              </address>
            </div>
            
            <div className="flex items-center gap-3">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              <p className="text-green-600 font-semibold">
                Open 24/7 - Always Here to Help!
              </p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="space-y-4">
            <Link href="tel:+1234567890" className="block">
              <Button className="w-full py-4 text-lg font-semibold flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <PhoneIcon className="w-6 h-6" />
                Call Now: (123) 456-7890
              </Button>
            </Link>
            
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full py-4 text-lg font-medium border-2 hover:bg-gray-50 transition-all duration-300">
                Employee Portal
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
