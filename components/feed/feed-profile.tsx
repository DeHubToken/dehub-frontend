import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { createAvatarName } from "@/libs/utils";
type Props = {
  avatar: string;
  name: string;
  time:string;
};

export function FeedProfile(props: Props) {
  const { avatar, name, time } = props;
  return (
    <div className="flex gap-2">
      <Avatar>
        <AvatarFallback>{createAvatarName(name)}</AvatarFallback>
        <AvatarImage className="object-cover" src={avatar} />
      </Avatar>
      <div className="flex flex-col">
        <span className="text-[15px]">{name}</span>
        <span className="text-theme-monochrome-300 text-[10px]">{dayjs(time).fromNow()}</span>
      </div>
    </div>
  );
}
