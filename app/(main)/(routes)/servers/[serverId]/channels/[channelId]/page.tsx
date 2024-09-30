import { ChatHeader } from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn(); // Updated to the new recommended function
    }

    const channel = await db.channel.findFirst({
        where: {
            id: params.channelId, // Ensure you're getting the channel by its ID
            serverId: params.serverId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        }
    });

    if (!channel || !member) {
        return redirect('/');
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
            <ChatMessages member={member} name={channel.name} chatId={channel.id} type="channel" apiUrl='/api/messages' socketUrl="/api/socket/messages" socketQuery={{
                channelId: channel.id, serverId: channel.serverId,
            }} paramKey='channelId' paramValue={channel.id}/>
            <div className='flex-1'></div>
            <ChatInput name={channel.name} type="channel" apiUrl='/api/socket/messages' query={{
                channelId: channel.id,
                serverId: channel.serverId,
            }}/>
        </div>
    );
}

export default ChannelIdPage;
