'use client';

import { UploadButton } from "uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function BannerUploader({ onUpload }: { onUpload: (url: string) => void }) {
  return (
    <UploadButton<OurFileRouter>
      endpoint="bannerUploader"
      onClientUploadComplete={(res) => {
        const url = res?.[0]?.url;
        if (url) onUpload(url);
      }}
      onUploadError={(e) => alert(`Upload failed: ${e.message}`)}
    />
  );
}
