"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Web3ContextType {
  isConnected: boolean;
  userAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  async function checkIfWalletIsConnected() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];
        if (accounts.length > 0) {
          setIsConnected(true);
          setUserAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        // First, try to switch to Camino network
        await switchToCaminoNetwork();

        // Then request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Get the current chainId
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // Check if we're on the correct network
        if (chainId !== "0x1f5") {
          alert("Please switch to the Camino Columbus network");
          return;
        }

        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];

        setIsConnected(true);
        setUserAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature");
    }
  }

  async function switchToCaminoNetwork() {
    try {
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x1f5",
            chainName: "Columbus",
            nativeCurrency: {
              name: "Camino",
              symbol: "CAM",
              decimals: 18,
            },
            rpcUrls: ["https://columbus.camino.network/ext/bc/C/rpc"],
            blockExplorerUrls: ["https://explorer.camino.foundation/"],
          },
        ],
      });
    } catch (error) {
      console.error("Error switching to Camino network:", error);
      throw error;
    }
  }

  function disconnectWallet() {
    setIsConnected(false);
    setUserAddress("");
  }

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        userAddress,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
} 