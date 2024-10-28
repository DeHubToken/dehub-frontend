"use client";

import { FC, useEffect, useState } from "react";
import { ethers } from "ethers";

// import { useTransferTokens } from "@/hooks/use-web3";

import { usersSearch } from "@/services/user";

import { getImageUrl } from "@/web3/utils/url";

interface UserSearchModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

interface User {
  name: string;
  address: string;
}

const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`; // e.g., 0xabcdef...1234
};

const UserSearchModal: FC<UserSearchModalProps> = ({ setIsModalOpen }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  // const { transferBJTokens } = useTransferTokens();

  // Function to handle user search
  const handleSearch = async (query: string) => {
    console.log(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const res: any = await usersSearch(query);
      console.log(res);
      setSearchResults(res.data.result);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to trigger search when query changes
  useEffect(() => {
    const debounceSearch = setTimeout(() => handleSearch(searchQuery), 300); // Debounce search
    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  // Function to handle selecting a user from the search results
  const handleUserSelect = (userAddress: string) => {
    setRecipientAddress(userAddress);
  };

  // Function to handle transferring $bj tokens to another user
  // const handleTransfer = async () => {
  //   try {
  //     const tx = await transferBJTokens(
  //       recipientAddress,
  //       ethers.utils.parseUnits(transferAmount, 18)
  //     );
  //     setTxHash(tx.hash);
  //     console.log("Transfer successful!", tx);
  //   } catch (error) {
  //     console.error("Error transferring $bj tokens:", error);
  //   }
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="shadow-lg relative w-96 rounded-lg bg-gray-800 p-6">
        {/* Close button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute right-2 top-2 text-gray-400 transition hover:text-white"
        >
          &times; {/* Close Cross */}
        </button>

        <h3 className="mb-4 text-xl font-semibold text-white">Transfer $bj Tokens</h3>
        <input
          type="number"
          placeholder="Amount to transfer"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-white placeholder-gray-400"
        />

        <h3 className="mb-4 text-xl font-semibold text-white">Search for a User</h3>
        <input
          type="text"
          placeholder="Enter username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 p-2 text-white placeholder-gray-400"
        />

        {/* Loading spinner */}
        {loading && <Spinner />}
        <>{recipientAddress ? `To: ${truncateAddress(recipientAddress)}` : <></>}</>
        {/* Display search results */}
        <ul className="mt-2 max-h-60 overflow-y-auto">
          {searchResults.map((user: any) => (
            <li
              key={user.address}
              onClick={() => handleUserSelect(user.address)}
              className="cursor-pointer rounded-lg bg-gray-900 p-3 text-white transition hover:bg-gray-700"
            >
              <div className="flex gap-2">
                <div className="w-[20%]">
                  {/* <Avatar name={user.username || user.displayName || ""}  url={user.avatarImageUrl} /> */}
                  <img src={getImageUrl(user.avatarImageUrl)} />
                </div>
                <div className="w-[80%]">
                  <div>{user.username}</div>
                  <div className="text-gray">{truncateAddress(user.address)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Transfer button */}
        {/* <button
          onClick={handleTransfer}
          className="mt-4 w-full rounded-lg bg-gray-600 py-2 text-white transition hover:bg-gray-500"
        >
          Transfer
        </button> */}

        {txHash && <p className="mt-2 text-green-400">Transaction Hash: {txHash}</p>}
      </div>
    </div>
  );
};

export default UserSearchModal;

const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-b-4 border-t-4 border-gray-300 border-b-blue-500 border-t-blue-500" />
  </div>
);
