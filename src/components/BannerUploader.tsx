'use client';

import { UploadButton } from "@/lib/uploadthing";

export default function BannerUploader() {
  return (
    <div className="p-4">
      <p>Upload your banner here:</p>
      <UploadButton
        endpoint="bannerUploader"
        onClientUploadComplete={(res) => {
          console.log("✅ Upload complete:", res);
          alert("Uploaded!");
        }}
        onUploadError={(e) => {
          console.error("❌ Upload failed:", e.message);
          alert(`Upload failed: ${e.message}`);
        }}
      />
    </div>
  );
}

