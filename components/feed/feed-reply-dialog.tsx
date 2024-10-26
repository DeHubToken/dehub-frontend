import { ImagePlus, SendHorizonal } from "lucide-react";

import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { createAvatarName } from "@/libs/utils";

/* ----------------------------------------------------------------------------------------------- */

type TComment = { id: string; avatar: string; name: string; time: string; content: string };
type Props = React.ComponentProps<typeof Dialog> & {
  comments: Array<TComment>;
};

export function FeedReplyDialog(props: Props) {
  const { children, comments, ...rest } = props;
  return (
    <Dialog {...rest}>
      <DialogContent className="max-w-2xl p-4">
        <DialogTitle className="sr-only">Reply to feed</DialogTitle>
        <DialogDescription className="sr-only">Reply to feed</DialogDescription>
        <div className="flex flex-col gap-8 rounded-3xl p-5 dark:bg-theme-mine-shaft-dark">
          {children}

          <div className="flex max-h-52 flex-col gap-6 overflow-y-scroll px-5">
            {comments.map((comment) => (
              <Comment key={comment.id} {...comment} />
            ))}
          </div>

          <ReplyInput />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Comment(props: TComment) {
  const { avatar, name, time, content } = props;
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>{createAvatarName(name)}</AvatarFallback>
        <AvatarImage src={avatar} alt={name} />
      </Avatar>
      <div className="flex flex-col rounded-lg">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium">{name}</span>
            <AvatarStar />
          </div>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-base dark:text-gray-300">{content}</p>
      </div>
    </div>
  );
}

function ReplyInput() {
  return (
    <div className="rounded-lg border px-5 dark:border-theme-mine-shaft">
      <div className="flex items-center gap-5 py-5">
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
          <AvatarImage
            src="https://pbs.twimg.com/profile_images/514553286775828481/9cvRurfY_400x400.jpeg"
            alt="Avatar"
          />
        </Avatar>
        <Input
          placeholder="Type here..."
          className="h-10 rounded-full text-sm placeholder:text-sm dark:bg-theme-mine-shaft"
        />

        <div className="flex items-center gap-2">
          <button className="size-10">
            <ImagePlus className="size-6 text-gray-600 dark:text-gray-300" />
          </button>
          <Button variant="gradientOne" className="size-10 p-0">
            <SendHorizonal className="size-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
