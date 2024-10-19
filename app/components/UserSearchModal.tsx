"use client"
import { useTransferTokens } from '@/hooks/use-web3';
import { usersSearch } from '@/services/user';
import { ethers } from 'ethers';
import { useState, FC, useEffect } from 'react';
import { getImageUrl } from '@/web3/utils/url';

interface UserSearchModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

interface User {
  name: string;
  address: string;
}

const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`; // e.g., 0xabcdef...1234
  };

const UserSearchModal: FC<UserSearchModalProps> = ({ setIsModalOpen }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const { transferBJTokens } = useTransferTokens();


  // Function to handle user search
  const handleSearch = async (query: string) => {
    console.log(query)
    if (!query) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const res: any = await usersSearch(query);
      console.log(res)
      setSearchResults(res.data.result);
    } catch (error) {
      console.error('Error fetching users:', error);
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
  const handleTransfer = async () => {

    try {
      const tx = await transferBJTokens(
        recipientAddress,
        ethers.utils.parseUnits(transferAmount, 18)
      );
      setTxHash(tx.hash);
      console.log('Transfer successful!', tx);
    } catch (error) {
      console.error('Error transferring $bj tokens:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-96 relative">
        {/* Close button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
        >
          &times; {/* Close Cross */}
        </button>

        <h3 className="text-xl font-semibold text-white mb-4">Transfer $bj Tokens</h3>
        <input
          type="number"
          placeholder="Amount to transfer"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          className="border border-gray-600 rounded-lg p-2 mb-4 w-full bg-gray-700 text-white placeholder-gray-400"
        />

        <h3 className="text-xl font-semibold text-white mb-4">Search for a User</h3>
        <input
          type="text"
          placeholder="Enter username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-600 rounded-lg p-2 mb-4 w-full bg-gray-700 text-white placeholder-gray-400"
        />

        {/* Loading spinner */}
        {loading && <Spinner />}
        <>{recipientAddress ?`To: ${truncateAddress(recipientAddress) }`: <></>}</> 
        {/* Display search results */}
        <ul className="max-h-60 overflow-y-auto mt-2">
          {searchResults.map((user:any) => (
            <li
              key={user.address}
              onClick={() => handleUserSelect(user.address)}
              className="cursor-pointer bg-gray-900 hover:bg-gray-700 p-3 rounded-lg transition text-white"
            >
                <div className='flex gap-2'>
                    <div className='w-[20%]'> 
                        {/* <Avatar name={user.username || user.displayName || ""}  url={user.avatarImageUrl} /> */}
                        <img src={getImageUrl(user.avatarImageUrl)} />
                    </div>
                    <div className='w-[80%]'>
                        <div>{user.username}</div>
                        <div className='text-gray'>{truncateAddress(user.address)}</div>
                    </div>
                </div>
            </li>
          ))}
        </ul>

        {/* Transfer button */}
        <button
          onClick={handleTransfer}
          className="mt-4 w-full bg-gray-600 text-white rounded-lg py-2 hover:bg-gray-500 transition"
        >
          Transfer
        </button>

        {txHash && <p className="text-green-400 mt-2">Transaction Hash: {txHash}</p>}
      </div>
    </div>
  );
};

export default UserSearchModal;

const Spinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-gray-300 border-t-blue-500 border-b-blue-500" />
    </div>
  );
  