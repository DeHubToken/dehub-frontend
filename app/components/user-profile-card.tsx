"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { truncate } from '@/libs/strings';
import { createAvatarName } from '@/libs/utils';
import { getBadgeUrl } from '@/web3/utils/calc';
import { useTheme } from 'next-themes';


interface UserProfileCardProps {
  // Required props
  address: string;
  createdAt: string; 
  username?: string;
  staked?: number;
  
  // Optional props
  displayName?: string;
  avatarUrl?: string;
  aboutMe?: string;
  followers?: number;
  following?: number;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  address,
  createdAt,
  username = '',
  staked = 0,
  displayName = '',
  avatarUrl = '',
  aboutMe = '',
  followers = 0,
  following = 0,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const formattedJoinDate = format(new Date(createdAt), 'MMM yyyy');
  const displayUsername = username || truncate(address, 10);
  const nameToDisplay = displayName || username || truncate(address, 15);
  const { theme } = useTheme();
  
  return (
    <div className="relative">
      <div 
        className="flex items-start cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {createAvatarName(displayName || username || address)}
          </AvatarFallback>
          <AvatarImage src={avatarUrl} />
        </Avatar>
        
        <div className="flex flex-col gap-1 pl-3">
          <p className="text-xs font-bold text-theme-neutrals-200">
            {nameToDisplay}
          </p>
          
          <div className="flex items-start gap-1">
            <Link
              href={`/profile/${username || address}`}
              className="text-[10px] text-neutral-400"
              onClick={(e) => e.stopPropagation()} 
            >
              {truncate(username || address, 20)}
            </Link>
            
            <div className="relative h-3 w-3">
              <Image
                src={getBadgeUrl(staked, theme)}
                alt="User Badge"
                layout="fill"
                className={`object-contain`}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${username || address}`} onClick={(e) => e.stopPropagation()}>
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {createAvatarName(displayName || username || address)}
                </AvatarFallback>
                <AvatarImage src={avatarUrl} />
              </Avatar>
            </Link>
            
            <div className="flex flex-col">
              <Link 
                href={`/profile/${username || address}`} 
                className="text-sm font-bold text-theme-neutrals-200 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {displayName || username}
              </Link>
              
              <p className="text-xs text-neutral-400">
                {truncate(address, 16)}
              </p>
              
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src={getBadgeUrl(staked, theme)}
                  alt="User Badge"
                  width={12}
                  height={12}
                  className="object-contain"
                />
                <span className="text-xs text-neutral-500">
                  Staked: {staked}
                </span>
              </div>
            </div>
          </div>
          
          {aboutMe && (
            <p className="text-xs text-neutral-600 mt-3 line-clamp-3">
              {aboutMe}
            </p>
          )}
          
          <div className="flex justify-between mt-3 text-xs text-neutral-500">
            <span>Joined {formattedJoinDate}</span>
            <div>
              <span className="font-medium">{followers}</span> followers · 
              <span className="font-medium ml-1">{following}</span> following
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;