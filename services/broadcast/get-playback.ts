"use server";

import { getIngest, getSrc } from "@livepeer/react/external";
import { Livepeer } from "livepeer";

import { env } from "@/configs";

const livepeer = new Livepeer({
  apiKey: env.LIVEPEER_API_KEY
});

export const getPlaybackSource = async (playbackId: string) => {
  const playbackInfo = await livepeer.playback.get(playbackId);

  console.log(playbackInfo)
  const src = getSrc(playbackInfo.playbackInfo);

  return src;
};
