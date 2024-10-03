import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  // Fetch the current profile
  const profile = await currentProfile();

  // Redirect to sign-in if no profile is found
  if (!profile) {
    return redirectToSignIn();
  }

  // Find the server and check if the current profile is a member
  const server = await db.server.findFirst({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // If no server found, redirect to the home page
  if (!server) {
    return redirect('/');
  }

  return (
    <div className="h-full flex">
      {/* Server Sidebar */}
      <div className="xs:hidden md:flex md:w-60 bg-gray-800 z-20 flex-col fixed inset-y-0  md:pl-0">
        <ServerSidebar serverId={params.serverId} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex sm:pl-20 md:pl-60 flex-col overflow-y-auto h-full ">
        {children}
      </main>

    </div>
  );
};

export default ServerIdLayout;
