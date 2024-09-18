"use client";

import type { Comment, NFT } from "@/services/nfts";

import { useState } from "react";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { createAvatarName } from "@/libs/utils";

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
      <div className="flex size-auto items-center justify-start gap-2">
        <Button size="sm" onClick={() => setToggleReply(true)}>
          Reply
        </Button>
        <TipModal triggerProps={{ size: "sm" }} tokenId={0} to={comment.address} />
      </div>

      <div className="w-full" ref={parent}>
        {toggleReply && (
          <form
            action={action}
            className="mt-2 flex h-auto w-full flex-col items-start justify-start gap-4"
          >
            <Textarea placeholder="Type your message here." {...commentForm.register("comment")} />
            {commentForm.formState.errors.comment && (
              <p className="text-red-500">{commentForm.formState.errors.comment.message}</p>
            )}
            <div className="flex size-auto items-center justify-start gap-2">
              <SubmitButton>Reply</SubmitButton>
              <Button size="sm" type="button" onClick={() => setToggleReply(false)}>
                Cancel
              </Button>
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
    <div className="mt-10 flex h-auto w-full flex-col items-start justify-start gap-4">
      {/* TODO: Make seperate component <CommentForm/> */}
      <form className="flex w-full flex-col items-end gap-3" action={action}>
        <div className="w-full">
          <Textarea placeholder="Type your message here." {...commentForm.register("comment")} />
          {commentForm.formState.errors.comment && (
            <p className="text-red-500">{commentForm.formState.errors.comment.message}</p>
          )}
        </div>
        <div className="flex items-center">
          <SubmitButton className="min-w-[80px]">Comment</SubmitButton>
        </div>
      </form>

      {!nft.comments.length && (
        <div className="flex w-full items-center justify-center">
          <p className="text-lg">No comments yet.</p>
        </div>
      )}

      {/* TODO: Make seperate component. <CommentsList /> */}
      <div
        ref={parent}
        className="flex h-auto w-full flex-col items-start justify-start gap-4 border-t border-theme-mine-shaft-dark dark:border-theme-mine-shaft"
      >
        {nft.comments.map((comment) => (
          <div key={comment.id} className="flex h-auto w-full items-start justify-start gap-4 p-5">
            <Link
              href={`/${comment.writor.username || comment.address}`}
              className="size-12 overflow-hidden rounded-full"
            >
              <Avatar>
                <AvatarFallback className="bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark">
                  {createAvatarName(comment.writor.username).toUpperCase()}
                </AvatarFallback>
                <AvatarImage
                  src={comment.writor.avatarUrl}
                  alt={comment.writor.username}
                  className="size-full object-cover"
                />
              </Avatar>
            </Link>
            <div className="flex h-auto w-full flex-col items-start justify-start gap-2">
              <p className="flex items-center gap-2 text-sm font-medium">
                {comment.writor.username || comment.address}
                <span>{new Date(comment.updatedAt).toDateString()}</span>
              </p>
              <p
                className="whitespace-pre-line text-base font-medium"
                dangerouslySetInnerHTML={{
                  __html: comment.content
                }}
              />
              <ReplyToComment comment={comment} />

              {comment.replyIds
                .map((id) => nft.comments.find((c) => Number(c.id) === Number(id)))
                .map((reply) => {
                  if (!reply) return null;
                  return (
                    <div
                      key={reply.id}
                      className="flex h-auto w-full items-start justify-start gap-4 rounded-2xl bg-theme-mine-shaft-dark p-5 dark:bg-theme-mine-shaft-dark"
                    >
                      <Link
                        href={`/${reply.writor.username || reply.address}`}
                        className="size-12 overflow-hidden rounded-full"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={reply.writor.avatarUrl}
                          alt={reply.writor.username}
                          className="size-full object-cover"
                        />
                      </Link>
                      <div className="flex h-auto w-full flex-col items-start justify-start gap-2">
                        <p className="flex items-center gap-2 text-sm font-medium">
                          {reply.writor.username || reply.address}
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
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmitButton(props: React.ComponentProps<typeof Button>) {
  const status = useFormStatus();
  return (
    <Button variant="gradientOne" size="md" type="submit" {...props} disabled={status.pending}>
      {status.pending && <Spinner />}
      {!status.pending && "Comment"}
    </Button>
  );
}
