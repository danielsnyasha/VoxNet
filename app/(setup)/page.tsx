import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from 'next/navigation';
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();

  // Check if the returned value is a redirect (NextResponse) or a profile object
  if (!('id' in profile)) {
    return profile;  // This would return the redirect response
  }

  // Proceed with server query if profile is valid
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal/>;
};

export default SetupPage;
