import { Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWeb3 } from "@/contexts/Web3Context";

export const Navigation = () => {
  const { isConnected, userAddress, connectWallet, disconnectWallet } =
    useWeb3();

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Bike className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Cryptourists
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="/tours"
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Tours
          </Link>
          {isConnected && (
            <Link
              href="/bookings"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              My Bookings
            </Link>
          )}
          <Link
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Contact
          </Link>
          {isConnected ? (
            <div className="flex items-center space-x-3 ml-2">
              <span className="text-sm bg-blue-50 text-blue-700 py-1.5 px-3 rounded-full font-medium">
                {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </span>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};
