import { useState } from "react";
import { CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { joinGroup, searchUserOrGroup } from "@/services/dm";

import { getAvatarUrl } from "@/web3/utils/url";

import { useMessage } from "./provider";

// Interface for the API response
interface SearchUserResponse {
  success: boolean;
  data?: { users: User[]; message?: string };
  message?: string;
}

// Interface for a single user
interface User {
  _id: string;
  address: string;
  avatarImageUrl?: string;
  aboutMe?: string | null;
  createdAt: string;
  updatedAt: string;
  discordLink?: string | null;
  displayName?: string | null;
  email?: string | null;
  facebookLink?: string | null;
  followers: number;
  instagramLink?: string | null;
  likes: number;
  online: boolean;
  receivedTips: number;
  sentTips: number;
  telegramLink?: string | null;
  tiktokLink?: string | null;
  twitterLink?: string | null;
  uploads: number;
  username: string;
  youtubeLink?: string | null;
}

export const AddUserInChatModal = () => {
  const [toggleAddMembersListModal, setToggleAddMembersListModal] = useState<boolean>(false);
  const handleToggleAddMembersListModal = () => {
    setToggleAddMembersListModal((prev: boolean) => !prev);
  };
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { account }: any = useActiveWeb3React();
  const {refresh, selectedMessage: message } = useMessage("AddUserInChatModal");
  const { _id:dmId }:any = message;
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setError("");

    try {
      const response: any | undefined = await searchUserOrGroup({ q: searchTerm });
      if (response?.success && response.data?.users) {
        setSearchResults(response.data.users);
      } else {
        setSearchResults([]); // Clear results if the response is not as expected
        setError("No users found.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch search results.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddNewUserInGroup = (user: any) => {
    if (!account && !user?.address) {
      return;
    }
    joinGroup({
      address: account,
      userAddress: user?.address,
      groupId: dmId,
      planId: ""
    }).then(() => {
      handleToggleAddMembersListModal();
      refresh()
    });
  };
  return (
    <Dialog open={toggleAddMembersListModal} onOpenChange={handleToggleAddMembersListModal}>
      <DialogTrigger className="w-full">
        <Button className="w-full">Add Member</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1400px] sm:rounded-3xl">
        <DialogTitle className="sr-only">New DM</DialogTitle>
        <DialogDescription className="sr-only">Start a direct message</DialogDescription>
        <DialogHeader className="flex flex-row gap-4">
          <h3>Add new member</h3>
        </DialogHeader>
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter username or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Find"}
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="max-h-80 overflow-y-auto">
            {isLoading && <p className="text-gray-500">Loading...</p>}
            {searchResults.length > 0
              ? searchResults.map((user) => (
                  <div key={user._id} className="flex items-center gap-4 rounded p-2">
                    <img
                      src={getAvatarUrl(user?.avatarImageUrl || "")}
                      alt={`${user.displayName || user.username}'s avatar`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold">{user.displayName || user.username}</span>
                      <span className="text-sm text-gray-500">{user.address}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="ml-auto"
                      onClick={() => handleAddNewUserInGroup(user)}
                    >
                      Add
                    </Button>
                  </div>
                ))
              : !isLoading && <p className="text-gray-500">No users found</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
