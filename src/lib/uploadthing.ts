import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  bannerUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("✅ Upload complete for", file.url);
      // optionally store file.url in your DB or logs
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

