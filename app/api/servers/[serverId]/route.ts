import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: { serverId: string } }) {
    try {
        const { serverId } = context.params;
        
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const server = await db.server.delete({
            where: {
                id: serverId,
                profileId: profile.id,
            },
        });

        if (!server) {
            return new NextResponse('Server not found', { status: 404 });
        }

        return NextResponse.json({ message: "Server successfully deleted" });

    } catch (error) {
        console.log("[SERVER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request, context: { params: { serverId: string } }) {
    try {
        const { serverId } = context.params;
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            },
        });

        if (!server) {
            return new NextResponse('Server not found', { status: 404 });
        }

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
