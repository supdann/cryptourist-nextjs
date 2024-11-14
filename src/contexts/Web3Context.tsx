"use client";

import { CONTRACT_ADDRESS } from "@/lib/constants";
import { contractABI } from "@/lib/contractABI";
import { Booking } from "@/types";
import { Contract, ethers, formatUnits } from "ethers";
import { BrowserProvider } from "ethers";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Web3ContextType {
  isConnected: boolean;
  userAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getAllBookings: () => Promise<Booking[]>;
  payBooking: (bookingId: number, amount: string) => Promise<void>;
}

interface RawBookingData {
  ids: bigint[];
  amounts: bigint[];
  operatorFees: bigint[];
  timestamps: bigint[];
  customers: string[];
  payers: string[];
  paidStatus: boolean[];
  completedStatus: boolean[];
  refundedStatus: boolean[];
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

  async function getAllBookings(): Promise<Booking[]> {
    if (!window.ethereum) {
      return [];
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, contractABI, signer);

    const result = await contract.getAllBookings();
    console.log("Raw contract result:", result);

    if (!result) {
      throw new Error("No booking data returned from contract");
    }

    const transformedBookings = transformData(result);
    return transformedBookings;
  }

  function fromWei(value: string, unit: string) {
    return formatUnits(value, unit);
  }

  // async function getBookingDetails(bookingId: bigint): Promise<Booking> {
  //   const bookings = await getAllBookings();
  //   return bookings.find((booking) => booking.id === bookingId);
  // }

  function transformData(
    rawData:
      | RawBookingData
      | [
          bigint[],
          bigint[],
          bigint[],
          bigint[],
          string[],
          string[],
          boolean[],
          boolean[],
          boolean[]
        ]
  ): Booking[] {
    const ids = "ids" in rawData ? rawData.ids : rawData[0];
    const amounts = "amounts" in rawData ? rawData.amounts : rawData[1];
    const operatorFees =
      "operatorFees" in rawData ? rawData.operatorFees : rawData[2];
    const timestamps =
      "timestamps" in rawData ? rawData.timestamps : rawData[3];
    const customers = "customers" in rawData ? rawData.customers : rawData[4];
    const payers = "payers" in rawData ? rawData.payers : rawData[5];
    const paidStatus =
      "paidStatus" in rawData ? rawData.paidStatus : rawData[6];
    const completedStatus =
      "completedStatus" in rawData ? rawData.completedStatus : rawData[7];
    const refundedStatus =
      "refundedStatus" in rawData ? rawData.refundedStatus : rawData[8];

    return ids.map((id, index) => ({
      id: Number(id),
      totalAmount: parseFloat(fromWei(amounts[index].toString(), "ether")),
      operatorFee: parseFloat(fromWei(operatorFees[index].toString(), "ether")),
      timestamp: new Date(Number(timestamps[index]) * 1000),
      customer: customers[index],
      payer: payers[index],
      isPaid: Boolean(paidStatus[index]),
      isCompleted: Boolean(completedStatus[index]),
      isRefunded: Boolean(refundedStatus[index]),
    }));
  }

  async function payBooking(bookingId: number, amount: string): Promise<void> {
    if (!window.ethereum) {
      throw new Error("Ethereum provider not found");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, contractABI, signer);

      // Call the smart contract's payBooking function
      const tx = await contract.payBooking(bookingId, {
        value: ethers.parseUnits(amount, "ether"),
      });

      await tx.wait();
    } catch (error) {
      console.error("Error paying for booking:", error);
      throw error;
    }
  }

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        userAddress,
        connectWallet,
        disconnectWallet,
        getAllBookings,
        payBooking,
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
