import React, { useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { dmMediaUrl } from "@/web3/utils/url";

type Props = {
  isPaid: boolean;
  isLocked: boolean;
  amount: number;
  mediaUrls: {
    url: string;
    type: string;
    mimeType: string;
  }[];
  token: string;
  chainId: number;
};

const MediaView = (props: Props) => {
  const { mediaUrls } = props;
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    mimeType: string;
  } | null>(null);

  const renderPreview = (media: { url: string; mimeType: string,type:string }) => {
    const { url, mimeType ,type} = media;

    if (mimeType === "image/gif" ||type=="gif") {
      return <img src={url} alt="Preview"  height={200} width={200} />;
    }
    return (
      <div
        style={{
          position: "relative",
          width: "100px", // Small preview size
          maxHeight: "100px",
          minHeight: "50px",
          margin: "5px",
          cursor: "pointer",
          border: "1px solid #ccc",
          borderRadius: "5px",
          overflow: "hidden"
        }}
        onClick={() => setSelectedMedia(media)} // Open full view on click
      >
        {mimeType.startsWith("image/") ? (
          <Image src={dmMediaUrl(url)} alt="Preview" layout="fill" objectFit="cover" />
        ) : (
          <ReactPlayer
            url={dmMediaUrl(url)}
            controls={false}
            playing={false}
            width="100%"
            height="auto"
            style={{ background: "black" }}
          />
        )}
      </div>
    );
  };
  const renderFullView = () => {
    if (!selectedMedia) return null;

    const { url, mimeType } = selectedMedia;

    return (
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Media Viewer</DialogTitle>
          </DialogHeader>
          <div style={{ textAlign: "center" }}>
            {mimeType.startsWith("image/") ? (
              <Image
                src={dmMediaUrl(url)}
                alt="Full View"
                width={600}
                height={400}
                objectFit="contain"
                style={{ borderRadius: "8px" }}
              />
            ) : mimeType.startsWith("video/") ? (
              <ReactPlayer
                url={dmMediaUrl(url)}
                controls
                width="100%"
                height="auto"
                style={{ background: "black" }}
              />
            ) : (
              <div style={{ color: "#000" }}>Unsupported media type</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start"
        }}
      >
        {mediaUrls.map((media, index) => (
          <React.Fragment key={index}>{renderPreview(media)}</React.Fragment>
        ))}
      </div>
      {renderFullView()}
    </div>
  );
};

export default MediaView;
