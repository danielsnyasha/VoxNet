import { auth } from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
// Handle authentication, throwing an error if unauthorized
const handleAuth = () => {
    const { userId } = auth();  // Destructure userId from auth
    if (!userId) throw new UploadThingError("Unauthorized");  // Throw error if user is not authenticated
    return { userId };  // Return userId as middleware expects an object
};
 
// FileRouter for your app, handling different upload routes (serverImage, etc.)
export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .middleware(() => {
            return handleAuth();  // Return the result of handleAuth, which includes the userId
        })
        .onUploadComplete(() => {
            // Handle the uploaded file completion, possibly using userId from middleware
         
        }),
    
    messageFile: f(["image", "pdf"])  // Additional file route for 'messageFile'
        .middleware(() => handleAuth() // Reuse the same authentication logic
    )
        .onUploadComplete(() => {
           
        })
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
