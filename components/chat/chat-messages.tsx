"use client";

import React, { Fragment } from 'react';
import { Member, Message, Profile } from '@prisma/client';
import ChatWelcome from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import ChatItem from './chat-item';

import {format} from 'date-fns'

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

const DATE_FORMAT = "dd MM yyyy, HH:mm";

interface ChatMessageProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

const ChatMessages: React.FC<ChatMessageProps> = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
}) => {
    const queryKey = `chat:${chatId}`;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    });

    // Handling loading state
    if (status === "pending") {
        return (
            <div className='flex flex-col flex-1 justify-center items-center'>
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading messages...</p>
            </div>
        );
    }

    // Handling error state
    if (status === "error") {
        return (
            <div className='flex flex-col flex-1 justify-center items-center'>
                <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>Something went wrong!</p>
            </div>
        );
    }

    // Rendering chat messages
    return (
        <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
            <div className='flex-1'>
                <ChatWelcome type={type} name={name} />
                <div className='flex flex-col-reverse mt-auto'>
                    {
                        data?.pages?.map((group, i) => (
                            <Fragment key={i}>
                                {group.items.map((message: MessageWithMemberWithProfile) => (
                                    <ChatItem key={message.id} id={message.id} member={message.member} currentMember={member} content={message.content} fileUrl={message.fileUrl} deleted={message.deleted} timestamp={format(new Date(message.createdAt), DATE_FORMAT)} isUpdated={message.updatedAt !== message.createdAt} socketUrl={socketUrl} socketQuery={socketQuery} />
                                ))}
                            </Fragment>
                        ))
                    }
                </div>
            </div>
            {/* Add loader or pagination logic here */}
        </div>
    );
};

export default ChatMessages;
