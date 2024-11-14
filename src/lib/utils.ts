import { type ClassValue, clsx } from "clsx";
import { BigNumberish, formatUnits } from "ethers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromWei(value: BigNumberish, unit: string) {
  return formatUnits(value, unit);
}

export function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price / 10 ** 18);
}

export function bigIntToNumber(value: BigNumberish) {
  return Number(value);
}

export function generateAvailableDates(numberOfDates: number = 10): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  while (dates.length < numberOfDates) {
    const randomDate = new Date(
      today.getTime() +
        Math.random() * (thirtyDaysFromNow.getTime() - today.getTime())
    );

    // Ensure we don't add duplicate dates
    if (
      !dates.some((date) => date.toDateString() === randomDate.toDateString())
    ) {
      dates.push(randomDate);
    }
  }

  return dates.sort((a, b) => a.getTime() - b.getTime());
}
