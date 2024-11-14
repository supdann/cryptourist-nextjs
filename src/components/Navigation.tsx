import { Bike, Settings, LogOut, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWeb3 } from "@/contexts/Web3Context";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useCart } from "@/contexts/CartContext";

export const Navigation = () => {
  const { isConnected, userAddress, connectWallet, disconnectWallet } =
    useWeb3();
  const router = useRouter();
  const { items } = useCart();

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
              CRYPTOurists
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Home
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
            href="/contact"
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Contact
          </Link>
          {isConnected ? (
            <div className="flex items-center space-x-3 ml-2">
              <Link href="/shopping-cart" className="relative">
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Button>
              </Link>
              <span className="text-sm bg-blue-50 text-blue-700 py-1.5 px-3 rounded-full font-medium">
                {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </span>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User actions">
                  <DropdownItem
                    key="settings"
                    startContent={<Settings className="mr-2 h-4 w-4" />}
                    onClick={() => router.push("/settings")}
                  >
                    Settings
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    startContent={<LogOut className="mr-2 h-4 w-4" />}
                    onClick={disconnectWallet}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
