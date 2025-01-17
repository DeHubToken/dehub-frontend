// "use client"
// import { SwapDefault } from "@coinbase/onchainkit/swap";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent } from "@/components/ui/dialog";

// type Props = {};

// // Define each token with the required properties and ensure the address matches the template literal type `0x${string}`
// const wethToken = {
//   address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as `0x${string}`,
//   name: "Wrapped Ether",
//   symbol: "WETH",
//   decimals: 18,
//   chainId: 1,
//   image: "https://example.com/weth.png",
// };

// const usdcToken = {
//   address: "0xA0b86991c6218B36c1D19D4a2e9Eb0cE3606eB48" as `0x${string}`,
//   name: "USD Coin",
//   symbol: "USDC",
//   decimals: 6,
//   chainId: 1,
//   image: "https://example.com/usdc.png",
// };

// const ethToken = {
//   address: "0x0000000000000000000000000000000000000000" as `0x${string}`,
//   name: "Ether",
//   symbol: "ETH",
//   decimals: 18,
//   chainId: 1,
//   image: "https://example.com/eth.png",
// };

// const degenToken = {
//   address: "0x123456789abcdef0123456789abcdef01234567" as `0x${string}`,
//   name: "Degen Token",
//   symbol: "DEGEN",
//   decimals: 18,
//   chainId: 1,
//   image: "https://example.com/degen.png",
// };

// // Swappable token arrays
// const swappableFromTokens = [wethToken, usdcToken, ethToken, degenToken];
// const swappableToTokens = [degenToken, ethToken, usdcToken, wethToken];

// const SwapOnChain = () => {
//   return <SwapDefault from={swappableFromTokens} to={swappableToTokens} />;
// };

// const SwapOnChainModal = (props: Props) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);

//   return (
//     <div>
//       <Button onClick={openModal}>Open Swap Modal</Button>
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent>
//           <Button onClick={closeModal}>Close</Button>
//           <SwapOnChain />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default SwapOnChainModal;
