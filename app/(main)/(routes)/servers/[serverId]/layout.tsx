import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const ServerIdLayout = async ({
    children, params,
}: {
    children: React.ReactNode;
    params: { serverId: string };
}) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!server) {
        return redirect('/');
    }

    return (
        <div className="h-full">
            {/* Sidebar */}
            <div className=" md:flex md:w-60 bg-gray-800 z-20 flex-col fixed inset-y-0 pl-4">
                <ServerSidebar />
            </div>
            {/* Main Content */}
            <main className="h-full flex flex-col">{children}</main>
        </div>
    );
};

export default ServerIdLayout;
