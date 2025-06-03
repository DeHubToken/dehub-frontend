import { cn } from "@/libs/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type Props = {
  title: string;
  description: string;
  posts: string;
};

export function TrendingCard(props: Props) {
  const { title, description, posts } = props;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base text-theme-neutrals-600">{description}</span>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl text-theme-neutrals-100">{title}</h1>
        <span className="text-xs font-semibold text-theme-neutrals-600">{posts} posts</span>
      </div>
    </div>
  );
}

export function TrendingContainer(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-6 rounded-3xl border border-theme-neutrals-800 p-4",
        props.className
      )}
    />
  );
}

type TrendingCreatorCardProps = {
  name: string;
  description: string;
  avatarUrl: string;
  onFollow?: () => void;
};

export function TrendingCreatorCard(props: TrendingCreatorCardProps) {
  const { name, description, avatarUrl, onFollow } = props;
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        <Avatar className="size-10">
          <AvatarFallback>CN</AvatarFallback>
          <AvatarImage src={avatarUrl} alt={name} />
        </Avatar>

        <div className="flex flex-col gap-2">
          <span className="text-base font-medium text-theme-neutrals-100">{name}</span>
          <span className="text-xs text-theme-neutrals-600">{description}</span>
        </div>
      </div>
      <Button variant="gradientOne" onClick={onFollow}>
        Follow
      </Button>
    </div>
  );
}
