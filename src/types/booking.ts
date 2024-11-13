export interface BlockchainBooking {
  receiver: string;
  id: bigint;
  tourId: bigint;
  date: bigint;
  status: string;
}

export interface Booking {
  id: number;
  tourId: number;
  date: Date;
  status: string;
} 