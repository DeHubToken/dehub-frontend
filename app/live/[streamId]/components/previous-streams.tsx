"use client";

import React, { useEffect, useState } from "react";

import { StreamsContainer } from "@/app/components/streams-container";

import { useMediaQuery } from "@/hooks/use-media-query";

import { getNFTs } from "@/services/nfts/trending";

const PreviousStreams = ({ stream }: { stream: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isVisible = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNFTs({
          owner: stream.address,
          sortMode: "live",
          unit: 40
        });

        if (res.success) {
          setData(res.data.result);
        } else {
          setError("Failed to fetch previous streams.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stream.address]);

  if (loading) {
    return <div>Loading previous streams...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data || data.length === 0) {
    return <></>;
  }

  if (!isVisible) return null;

  return (
    <div className="mt-28 flex h-auto w-full flex-col items-start justify-start gap-14 pb-14">
      <div className="h-auto w-full">
        <div className="flex h-auto w-full items-center justify-between">
          <h1 className="text-4xl">Previous Streams</h1>
        </div>
        <div className="mt-10 h-auto w-full">
          <StreamsContainer address={stream.address} isSearch={false} data={data} type="live" />
        </div>
      </div>
    </div>
  );
};

export default PreviousStreams;
