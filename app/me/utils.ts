import type { User } from "@/stores";

import { z } from "zod";

export const ZProfile = z.object({
  username: z
    .string({
      required_error: "Username is required"
    })
    .min(3, { message: "Username must be at least 3 characters" })
    .superRefine((data, ctx) => {
      if (!/^[a-zA-Z0-9-_]+$/.test(data)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Username only contains letters, numbers, hyphens and underscores",
          fatal: true
        });
        return z.NEVER;
      }

      return data;
    }),
  fullName: z
    .string({
      required_error: "Full name is required"
    })
    .min(3, { message: "Full name must be at least 3 characters" }),
  email: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  discord: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  telegram: z.string().optional(),
  youtube: z.string().optional(),
  about: z.string().optional()
});

export type TProfile = z.infer<typeof ZProfile>;

export function buildProfileFormData(data: TProfile) {
  const formData = new FormData();
  formData.append("username", data?.username);
  formData.append("displayName", data.fullName);
  formData.append("aboutMe", data.about || "");
  formData.append("email", data.email || "");
  formData.append("facebookLink", data.facebook || "");
  formData.append("twitterLink", data.twitter || "");
  formData.append("discordLink", data.discord || "");
  formData.append("instagramLink", data.instagram || "");
  formData.append("tiktokLink", data.tiktok || "");
  formData.append("youtubeLink", data.youtube || "");
  formData.append("telegramLink", data.telegram || "");
  return formData;
}

export function getFormDefaultValue(user: User): TProfile {
  return {
    username: user?.username || "",
    fullName: user.displayName || "",
    email: user.email || "",
    facebook: user.facebookLink || "",
    twitter: user.twitterLink || "",
    discord: user.discordLink || "",
    instagram: user.instagramLink || "",
    tiktok: user.tiktokLink || "",
    telegram: user.telegramLink || "",
    youtube: user.youtubeLink || "",
    about: user.aboutMe || ""
  };
}
