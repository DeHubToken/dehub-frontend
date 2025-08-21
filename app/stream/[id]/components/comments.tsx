"use client";

import type { Comment, NFT } from "@/services/nfts";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Send } from "@/components/icons/send";
import { VideoChat } from "@/components/icons/video-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { truncate } from "@/libs/strings";
import { cn, createAvatarName } from "@/libs/utils";

import { getAvatarUrl } from "@/web3/utils/url";
import { getSignInfo } from "@/web3/utils/web3-actions";

import { postComment } from "../actions";
import { TipModal } from "./tip-modal";

/* ----------------------------------------------------------------------------------------------- */

const commentSchema = z.object({
  comment: z
    .string({
      required_error: "This field is required."
    })
    .min(2, { message: "This field is required." })
});

type TCommentSchema = z.infer<typeof commentSchema>;

function ReplyToComment(props: { comment: Comment }) {
  const { comment } = props;

  const [parent] = useAutoAnimate();
  const { account, library } = useActiveWeb3React();

  const [toggleReply, setToggleReply] = useState(false);
  const commentForm = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema)
  });

  const action: () => void = commentForm.handleSubmit(async (data) => {
    if (!account) {
      toast.error("Please connect your wallet to comment.");
      return;
    }

    const _comment = data.comment.replace(/\n/g, "<br />");

    try {
      const sigData = await getSignInfo(library, account);
      const res = await postComment({
        streamTokenId: comment.tokenId,
        content: _comment,
        account,
        sig: sigData.sig,
        timestamp: sigData.timestamp,
        commentId: comment.id
      });

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      toast.success("Replied successfully.");
      commentForm.reset();
    } catch (err) {
      toast.error("An error occurred while replying.");
    }
  });

  return (
    <>
      <div className="mt-2 flex size-auto items-center justify-start gap-2">
        <TipModal triggerProps={{ size: "sm" }} tokenId={0} to={comment.address} />
        <Button
          className="h-9 rounded-full px-3"
          size="sm"
          onClick={() => setToggleReply((prev) => !prev)}
        >
          Reply
        </Button>
      </div>

      <div className="w-full" ref={parent}>
        {toggleReply && (
          <form
            action={action}
            className="mt-2 flex h-auto w-full flex-col items-start justify-start gap-4 rounded-3xl border border-theme-neutrals-800 p-4"
          >
            <div className="w-full">
              <span className="text-sm font-semibold text-theme-neutrals-500">Replay</span>
              <div className="mt-4 flex w-full items-center gap-2">
                <Input
                  className={cn(
                    "h-11 rounded-full px-3",
                    commentForm.formState.errors.comment &&
                      "border-red-600 focus-within:border-red-600 focus-within:shadow-none focus:border-red-600 focus:shadow-none"
                  )}
                  placeholder="Type..."
                  {...commentForm.register("comment")}
                />
                <Button type="button" className="h-9 rounded-full">
                  <VideoChat />
                </Button>
                <SubmitButton>Reply</SubmitButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export function CommentsPanel(props: { nft: NFT; tokenId: number }) {
  const { nft, tokenId } = props;

  const [parent] = useAutoAnimate();
  const { account, library } = useActiveWeb3React();

  const commentForm = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema)
  });

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

      toast.success("Commented successfully.");
      commentForm.reset();
    } catch (err) {
      toast.error("An error occurred while commenting.");
    }
  });

  return (
    <div className="flex h-auto w-full flex-col items-start justify-start gap-4">
      <form
        className="my-8 w-full rounded-3xl border border-theme-neutrals-800 p-4"
        action={action}
      >
        <span className="text-xs font-semibold text-theme-neutrals-500">Add your comment</span>
        <div className="mt-4 flex items-center gap-2">
          <Input
            className={cn(
              "h-11 rounded-full",
              commentForm.formState.errors.comment &&
                "border-red-600 focus-within:border-red-600 focus-within:shadow-none focus:border-red-600 focus:shadow-none"
            )}
            placeholder="Type.."
            {...commentForm.register("comment")}
          />
          <Button type="button" className="h-10 rounded-full">
            <VideoChat />
          </Button>
          <Button type="submit" className="h-10 rounded-full">
            <Send />
          </Button>
        </div>
      </form>

      {!nft.comments.length && (
        <div className="flex w-full items-center justify-center">
          <p className="text-lg">No comments yet.</p>
        </div>
      )}

      <div ref={parent} className="h-auto w-full rounded-3xl border border-theme-neutrals-800 p-4">
        <div className="px-4">
          <span className="text-sm font-semibold text-theme-neutrals-500">Comments</span>
        </div>
        <div className="mt-4 flex flex-col gap-6">
          {nft.comments.map((comment) => (
            <div key={comment.id} className="flex w-full flex-col items-end justify-start gap-4">
              <div className="flex h-auto w-full items-start justify-start gap-4 sm:p-5">
                <Link
                  href={`/${comment.writor?.username || comment.address}`}
                  className="size-8 overflow-hidden rounded-full sm:size-auto"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark">
                      {createAvatarName(comment.writor?.username).toUpperCase()}
                    </AvatarFallback>
                    <AvatarImage
                      src={getAvatarUrl(comment.writor?.avatarUrl)}
                      alt={comment.writor?.username}
                      className="size-full object-cover"
                    />
                  </Avatar>
                </Link>
                <div className="flex h-auto w-[calc(100%-48px)] flex-col items-start justify-start gap-2 sm:w-full">
                  <p className="flex items-center gap-2 text-sm font-semibold text-theme-neutrals-200">
                    {comment.writor?.username || truncate(comment.address, 10)}
                    <span className="font-normal text-theme-neutrals-500">
                      {new Date(comment.updatedAt).toDateString()}
                    </span>
                  </p>
                  <p
                    className="whitespace-pre-line text-base text-theme-neutrals-400"
                    dangerouslySetInnerHTML={{
                      __html: comment.content
                    }}
                  />
                  <ReplyToComment comment={comment} />
                </div>
              </div>

              {comment.replyIds
                .map((id) => nft.comments.find((c) => Number(c.id) === Number(id)))
                .map((reply) => {
                  if (!reply) return null;
                  return (
                    <div
                      key={reply.id}
                      className="flex h-auto w-full items-start justify-start gap-4 rounded-xl bg-theme-mine-shaft-dark p-3 dark:bg-theme-mine-shaft-dark sm:w-[calc(100%-5rem)]"
                    >
                      <Link
                        href={`/${reply.writor?.username || reply.address}`}
                        className="size-12 overflow-hidden rounded-full"
                      >
                        <Avatar>
                          <AvatarFallback className="bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark">
                            {createAvatarName(comment.writor?.username).toUpperCase()}
                          </AvatarFallback>
                          <AvatarImage
                            src={getAvatarUrl(reply.writor?.avatarUrl)}
                            alt={reply.writor?.username}
                            className="size-full object-cover"
                          />
                        </Avatar>
                      </Link>
                      <div className="flex h-auto w-full flex-col items-start justify-start gap-2">
                        <p className="flex items-center gap-2 text-sm font-medium">
                          {reply.writor?.username || truncate(reply.address, 10)}
                          <span>{new Date(reply.updatedAt).toDateString()}</span>
                        </p>
                        <p
                          className="whitespace-pre-line text-base font-medium"
                          dangerouslySetInnerHTML={{
                            __html: reply.content
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubmitButton(props: React.ComponentProps<typeof Button>) {
  const status = useFormStatus();
  return (
    <Button
      className="h-9 px-4"
      variant="gradientOne"
      size="md"
      type="submit"
      {...props}
      disabled={status.pending}
    >
      {status.pending && <Spinner />}
      {!status.pending && <Send />}
    </Button>
  );
}
