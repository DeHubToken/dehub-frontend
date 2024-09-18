"use client";

import type { User } from "@/stores/atoms/user";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateProfile } from "../hooks/use-update-profile";
import { getFormDefaultValue, ZProfile } from "../utils";
import { CancelButton } from "./edit-profile";

type Props = { user: User };

export function AccountInformationForm(props: Props) {
  const { user } = props;

  const { updateProfile } = useUpdateProfile();
  const form = useForm({
    resolver: zodResolver(ZProfile),
    defaultValues: getFormDefaultValue(user)
  });

  return (
    <form
      className="mt-12 h-auto w-full space-y-10 rounded-3xl p-6"
      onSubmit={form.handleSubmit(updateProfile)}
    >
      <h1 className="text-4xl">ACCOUNT INFO</h1>
      <div className="h-auto w-full space-y-4">
        <Input
          type="text"
          placeholder="Username"
          className="h-12 rounded-full p-4 text-sm"
          {...form.register("username")}
        />
        {form.formState.errors.username && (
          <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
        )}
        <Input
          type="text"
          placeholder="Full name"
          className="h-12 rounded-full p-4 text-sm"
          {...form.register("fullName")}
        />
        {form.formState.errors.fullName && (
          <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
        )}
        <Input
          type="email"
          placeholder="Email address"
          className="h-12 rounded-full p-4 text-sm"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
        <Textarea
          placeholder="Description"
          className="h-32 resize-none rounded-3xl p-4 text-sm"
          {...form.register("about")}
        />
      </div>

      <div className="h-auto w-full space-y-4">
        <h1 className="text-2xl">Social media</h1>
        <Input
          type="url"
          placeholder="Facebook"
          className="h-12 rounded-full p-4 text-sm"
          {...form.register("facebook")}
        />
        <Input
          type="url"
          placeholder="Instagram"
          className="h-12 rounded-full p-4 text-sm"
          {...form.register("instagram")}
        />
        <Input
          type="url"
          placeholder="Twitter"
          className="h-12 rounded-full p-4 text-sm"
          {...form.register("twitter")}
        />
        <Input
          type="url"
          placeholder="Discord"
          className="h-12 rounded-full p-4 text-sm"
          {...form.register("discord")}
        />
        <Input
          type="url"
          placeholder="Other"
          className="h-12 rounded-full p-4 text-sm"
          {...form.register("tiktok")}
        />
        <Button type="button" variant="secondary" size="sratch" className="gap-2 rounded-full py-5">
          Add other link
        </Button>
      </div>

      <Separator className="h-0.5 bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark" />

      <div className="size-auto space-x-4">
        <Button
          variant="gradientOne"
          size="sratch"
          className="gap-2 py-5"
          type="submit"
          disabled={form.formState.isLoading}
        >
          Save
        </Button>
        <CancelButton />
      </div>
    </form>
  );
}
