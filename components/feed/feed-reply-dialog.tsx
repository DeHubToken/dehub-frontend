import { useRef } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, SendHorizonal } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { postComment } from "@/app/feeds/[id]/actions";

import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { createAvatarName } from "@/libs/utils";

import { getSignInfo } from "@/web3/utils/web3-actions";

import { Spinner } from "../ui/spinner";

/* ----------------------------------------------------------------------------------------------- */

type TComment = { id: string; avatar: string; name: string; time: string; content: string };
type Props = React.ComponentProps<typeof Dialog> & {
  comments: Array<TComment>;
  tokenId: number;
  fetchFeed:()=>void;
};

export function FeedReplyDialog(props: Props) {
  const { children,fetchFeed, tokenId, comments, ...rest } = props;
  const [parent] = useAutoAnimate();
  return (
    <Dialog {...rest}>
      <DialogContent className="max-w-2xl p-4">
        <DialogTitle className="sr-only">Reply to feed</DialogTitle>
        <DialogDescription className="sr-only">Reply to feed</DialogDescription>
        <div className="flex flex-col gap-8 rounded-3xl p-5 dark:bg-theme-mine-shaft-dark">
          {children}

          <div ref={parent} className="flex max-h-52 flex-col gap-6 overflow-y-scroll px-5">
            {comments.map((comment) => (
              <Comment key={comment.id} {...comment} />
            ))}
          </div>

          <ReplyInput fetchFeed={fetchFeed} tokenId={tokenId} />
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

// Validation schema for the comment
const commentSchema = z.object({
  comment: z
    .string({
      required_error: "This field is required."
    })
    .min(2, { message: "This field is required." }),
  file: z.any().optional() // File is optional but can have further validation
});

type TCommentSchema = z.infer<typeof commentSchema>;

function ReplyInput(props: any) {
  const { fetchFeed, tokenId } = props;


  const { account, library } = useActiveWeb3React();

  const commentForm = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema)
  });

  const fileInputRef = useRef<any>(null);

  // Action for form submission
  const action: () => void = commentForm.handleSubmit(async (data) => {
    if (!account) {
      toast.error("Please connect your wallet to comment.");
      return;
    }
    const comment = data.comment.replace(/\n/g, "<br />");

    try {
      const sigData = await getSignInfo(library, account);

      const res = await postComment({
        streamTokenId: tokenId,
        content: comment,
        account,
        sig: sigData.sig,
        timestamp: sigData.timestamp
      });

      if (!res.success) {
        toast.error(res.error);
        return;
      }
      fetchFeed()
      toast.success("Commented successfully.");
      commentForm.reset();
    } catch (err) {
      toast.error("An error occurred while commenting.");
    }
  });

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Only JPEG, PNG, or GIF files are allowed.");
        return;
      }
      // File is valid; you can process or save it as needed
      console.log("Selected file:", file);
    }
  };

  return (
    <div className="rounded-lg border px-5 dark:border-theme-mine-shaft">
      <form onSubmit={action}>
        <div className="flex items-center gap-5 py-5">
          {/* User Avatar */}
          <Avatar>
            <AvatarFallback>U</AvatarFallback>
            <AvatarImage
              src="https://pbs.twimg.com/profile_images/514553286775828481/9cvRurfY_400x400.jpeg"
              alt="Avatar"
            />
          </Avatar>

          {/* Comment Input */}
          <Input
            placeholder="Type here..."
            {...commentForm.register("comment")}
            className="h-10 rounded-full text-sm placeholder:text-sm dark:bg-theme-mine-shaft"
          />

          {/* Hidden file input */}
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            id="file-input"
            onChange={(event) => {
              // Call react-hook-form's onChange handler
              commentForm.register("file").onChange(event); 
              // Call custom file change handler
              handleFileChange(event);
            }}
          />

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {/* File Upload Button */}
            <button type="button" className="size-10" onClick={handleFileUpload}>
              <ImagePlus className="size-6 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Submit Button */}
            <Button
              variant="gradientOne"
              type="submit"
              className="size-10 p-0"
              disabled={commentForm.formState.isSubmitting}
            >
              {commentForm.formState.isSubmitting ? (
                <Spinner />
              ) : (
                <SendHorizonal className="size-5 text-white" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReplyInput;
