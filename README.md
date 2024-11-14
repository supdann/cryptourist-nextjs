# CRYPTOurists

A Next.js-based decentralized application for booking blockchain-powered tours and travel experiences.

## Prerequisites

- Node.js 18+ 
- PNPM (Package Manager)
- MetaMask wallet extension
- Access to Camino Network

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
## Network Configuration

This dApp runs on the Camino Network. Make sure your MetaMask is configured with:

- Network Name: Columbus
- RPC URL: https://columbus.camino.network/ext/bc/C/rpc
- Chain ID: 501 (0x1f5)
- Currency Symbol: CAM
- Block Explorer: https://explorer.camino.foundation/

## Key Features

- Web3 Integration with MetaMask
- Smart Contract Interaction for Tour Bookings
- Dynamic Tour Listings
- Shopping Cart Functionality
- Booking Management System

## Project Structure

- `/src/app` - Next.js 13+ app router pages
- `/src/components` - Reusable React components
- `/src/contexts` - React context providers (Web3, Cart, Settings)
- `/src/lib` - Utility functions and constants
- `/src/types` - TypeScript type definitions

## Development Tools

- TypeScript
- TailwindCSS
- NextUI Components
- Ethers.js for Web3
- ESLint for code quality

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Camino Network Docs](https://docs.camino.network/)

## Deploy on Vercel

The easiest way to deploy your CRYPTOurists app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [deployment documentation](https://nextjs.org/docs/deployment) for more details.


## License

This project is licensed under the MIT License.