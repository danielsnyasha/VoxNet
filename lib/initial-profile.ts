import { currentUser, redirectToSignIn } from "@clerk/nextjs/server";
import { db } from '@/lib/db';

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  });

  if (profile) {
    return profile;
  }

  // Fallback values in case firstName, lastName, or email are undefined
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const emailAddress = user.emailAddresses?.[0]?.emailAddress ?? '';

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: fullName || 'Unnamed User',  // Handle cases where fullName might be empty
      imageUrl: '', // Adjust this if you are using it for profile pictures, otherwise set accordingly
      email: emailAddress  // This field is required in your schema
    }
  });

  return newProfile;
}
