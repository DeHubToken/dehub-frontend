import { useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";

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

import { createGroupChat, searchUserOrGroup } from "@/services/dm";
import { getPlans } from "@/services/subscription-plans";

import { getAvatarUrl } from "@/web3/utils/url";

import { useMessage } from "./provider";

interface SearchUserResponse {
  success: boolean;
  data?: { users: User[]; message?: string };
  message?: string;
}

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

export const NewGroupChatModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (d: boolean) => void;
}) => {
  const { account } = useActiveWeb3React();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedPlansIds, setSelectedPlansIds] = useState<number[]>([]);
  const [plans, setPlans] = useState([]);
  const { handleAddNewChat } = useMessage("NewGroupChatModal");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setError("");

    try {
      const response: any | undefined = await searchUserOrGroup({ q: searchTerm });
      if (response?.success && response.data?.users) {
        setSearchResults(response.data.users);
        setSearchTerm("");
      } else {
        setSearchResults([]);
        setError("No users found.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch search results.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.find((u) => u._id === user._id);
      if (isSelected) {
        return prev.filter((u) => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const togglePlanSelection = (planId: number) => {
    setSelectedPlansIds((prev) => {
      if (prev.includes(planId)) {
        return prev.filter((id) => id !== planId);
      } else {
        return [...prev, planId];
      }
    });
  };

  const handleCreateGroupChat = async () => {
    if (!account) {
      setError("Please connect to wallet");
      return;
    }

    if (selectedUsers.length < 2) {
      setError("You need at least two users to create a group chat.");
      return;
    }

    if (!groupName.trim()) {
      setError("Group name cannot be empty.");
      return;
    }

    const response: any = await createGroupChat({
      groupName,
      users: selectedUsers.map((user) => user._id),
      plans: selectedPlansIds,
      address: account?.toLowerCase()
    });
    const { success, error } = response;
    const data = response.data;

    if (!success) {
      toast.error(error);
      return;
    }

    handleAddNewChat(data);
    setGroupName("");
    setSearchTerm("");
    setSelectedUsers([]);
    setSearchResults([]);
    // Close dialog after successful creation
    setOpen(false);
    toast.success("Group chat created successfully!");
  };

  const fetchMyPlans = async () => {
    const { success, error, data }: any = await getPlans({ address: account?.toLowerCase() });
    if (!success && !data?.plans) {
      toast.error(error);
      return;
    }
    setPlans(data?.plans);
  };

  useEffect(() => {
    fetchMyPlans();
  }, [account]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button className="gap-2 py-5">
          <CirclePlus className="size-5" /> New Group Chat
        </Button> */}
      </DialogTrigger>
      <DialogContent className="max-w-[1400px] sm:rounded-3xl max-h-[80vh] overflow-auto w-[96%] rounded-xl">
        <DialogTitle className="sr-only">New Group Chat</DialogTitle>
        <DialogDescription className="sr-only">Start a group chat</DialogDescription>
        <DialogHeader className="flex flex-row gap-4">
          <h3>Start a new group chat</h3>
        </DialogHeader>
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex gap-4">
            <Input
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
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
              ? searchResults.map((user) => {
                  const isSelected = selectedUsers.find((u) => u._id === user._id);
                  return (
                    <div
                      key={user._id}
                      className={`flex items-center gap-4 rounded p-2 `}
                      onClick={() => toggleUserSelection(user)}
                    >
                      <img
                        src={getAvatarUrl(user?.avatarImageUrl || "")}
                        alt={`${user.displayName || user.username}'s avatar`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold">{user.displayName || user.username}</span>
                        <span className="text-sm text-gray-500 min-w-24 break-all">{`${user?.address?.substring(0, 6)}...${user?.address?.slice(-4)}`}</span>
                      </div>
                      {isSelected && <span className="ml-auto text-blue-500 ">Selected</span>}
                    </div>
                  );
                })
              : !isLoading && <p className="text-gray-500">No users found</p>}
          </div>
          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="shadow mt-4 rounded">
              <h4 className="mb-2 font-semibold">Selected Users:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div key={user._id} className="flex items-center gap-2 rounded-full">
                    <img
                      src={getAvatarUrl(user?.avatarImageUrl || "")}
                      alt={`${user.displayName || user.username}'s avatar`}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-sm">{user.displayName || user.username}</span>
                    <button
                      onClick={() => toggleUserSelection(user)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="gap-2 py-5">
            <h6>Add Subscribers</h6>
            <div className="flex flex-wrap gap-2">
              {plans.map((plan: any) => {
                const isSelected = selectedPlansIds.includes(plan.id);
                return (
                  <Button
                    key={plan.id}
                    onClick={() => togglePlanSelection(plan.id)}
                    className={isSelected ? "bg-green-500 text-white" : ""}
                  >
                    {plan.tier} Tier
                  </Button>
                );
              })}
            </div>
          </div>

          {selectedPlansIds.length > 0 && (
            <div className="shadow mt-6 rounded  p-4">
              <h6 className="mb-2 font-semibold ">Selected Tiers:</h6>
              <div className="flex flex-wrap gap-2">
                {plans
                  .filter((plan: any) => selectedPlansIds.includes(plan.id))
                  .map((plan: any) => (
                    <div
                      key={plan.id}
                      className="flex items-center gap-2 rounded-full  px-3 py-1 text-green-800"
                    >
                      <span>{plan.tier} Tier</span>
                      <button
                        onClick={() => togglePlanSelection(plan.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleCreateGroupChat}
            disabled={
              (selectedPlansIds.length < 1 || selectedUsers.length > 2) && !groupName.trim()
            }
            className="mt-4"
          >
            Create Group Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
