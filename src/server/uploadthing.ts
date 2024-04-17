import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from "@clerk/nextjs/server";

import { db } from "~/server/db";

const f = createUploadthing();

const auth = (req: NextApiRequest, res: NextApiResponse) => {


  const session = getAuth(req);
  const userId = session.userId;

  return {
    id: userId
  }
};
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res }) => {
      // This code runs on your server before upload
      const user = auth(req, res);

      const userId = user.id;
      // If you throw, the user will not be able to upload
      if (!user || !userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);


      await db.uploadedFile.create({
        data: {
          url: file.url,
          name: file.name,
          key: file.key,
          type: file.type,
          size: file.size,
          authorId: metadata.userId,
        }
      })


      console.log("file url", file.url);
      //TODO: here is where I need to save the uri data to the database...

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;