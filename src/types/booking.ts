export interface BlockchainBooking {
  id: bigint;
  totalAmount: bigint;
  operatorFee: bigint;
  timestamp: bigint;
  customer: string;
  payer: string;
  isPaid: boolean;
  isCompleted: boolean;
  isRefunded: boolean;
}

export interface Booking {
  id: number;
  totalAmount: number;
  operatorFee: number;
  timestamp: Date;
  customer: string;
  payer: string;
  isPaid: boolean;
  isCompleted: boolean;
  isRefunded: boolean;
} 