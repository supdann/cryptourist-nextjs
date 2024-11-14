"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { useSettings } from "@/contexts/SettingsContext";
import { ethers } from "ethers";

export default function SettingsPage() {
  const { isConnected } = useWeb3();
  const { settings, updateSettings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

 

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Validate the contract address format
      if (!ethers.isAddress(settings.contractAddress)) {
        throw new Error("Invalid contract address format");
      }

      await updateSettings({
        contractAddress: settings.contractAddress,
      });

      setMessage({
        type: "success",
        text: "Settings saved successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to save settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            Please connect your wallet to access settings.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-black">Settings</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Smart Contract Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="contractAddress"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contract Address
                </label>
                <Input
                  id="contractAddress"
                  value={settings.contractAddress}
                  onChange={(e) =>
                    updateSettings({
                      contractAddress: e.target.value,
                    })
                  }
                  placeholder="Enter smart contract address"
                  className="w-full"
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-md ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
