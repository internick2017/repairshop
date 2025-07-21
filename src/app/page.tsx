import { Button } from "@/components/ui/button";
import { PhoneIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-home-background bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <main className="bg-white/90 shadow-lg rounded-xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Francisco Computer <br /> Repair Shop
          </h1>
          <address className="not-italic text-gray-600 space-y-2">
            <p className="flex flex-col">
              <span className="font-semibold">123 Main St</span>
              <span>Anytown, USA 12345</span>
            </p>
          </address>
          <p className="text-green-600 font-medium">
            Open 24/7
          </p>
          <Link href="tel:+1234567890" className="block">
            <Button className="w-full py-3 text-base flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
              <PhoneIcon className="w-5 h-5" />
              Call Us
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
