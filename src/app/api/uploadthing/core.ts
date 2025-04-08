import { createUploadthing, type FileRouter } from "uploadthing";

const f = createUploadthing();

export const ourFileRouter = {
  bannerUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(() => ({}))
    .onUploadComplete(({ file }) => {
      console.log("✅ Uploaded:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

