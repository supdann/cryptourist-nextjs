import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { tourId, date, transactionHash } = await request.json();

    // Validate inputs
    if (!tourId || !date || !transactionHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Here we could add server-side validation or database operations
    // For example, storing the booking details in a database

    return NextResponse.json({
      success: true,
      message: "Booking recorded successfully",
      transactionHash,
    });
  } catch (error) {
    console.error("Error processing booking:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
