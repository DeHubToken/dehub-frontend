"use server";
import { Livepeer } from "livepeer";
import { getIngest } from "@livepeer/react/external";
import { env } from "@/configs";

const livepeer = new Livepeer({
  apiKey: env.LIVEPEER_API_KEY
});

export async function getIngestUrlForStreamId(streamId: string) {
  console.log(streamId);
  const stream = await livepeer.stream.get(streamId);

  return getIngest(stream.stream);
}

export async function getIngestUrlByStreamKey(streamKey: string) {
  console.log(env.LIVEPEER_API_KEY, streamKey, getIngest(streamKey));
  // const stream = await livepeer.stream.get(streamKey);
  return getIngest(streamKey);
}
