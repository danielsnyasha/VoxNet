"use client";

import React, { useEffect, useState } from 'react';
import { Member, Profile } from '@prisma/client';
import { UserAvatar } from '../user-avatar';
import { ActionTooltip } from '../action-tooltip';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"
import { ShieldAlert, ShieldCheck, FileText, Trash2, Edit3 } from 'lucide-react'; 
import axios from "axios";
import { cn } from '@/lib/utils'; 
import { Button } from '../ui/button';

import {
    Form,
    FormControl,
    FormItem,
    FormField,
  } from "@/components/ui/form";

  import { useRouter, useParams } from 'next/navigation';

import { Input } from '../ui/input';
import queryString from 'query-string';
import { useModal } from '@/hooks/use-modal-store';
import { toast } from 'react-toastify'; // Toast notification
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
  "ADMIN": <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
};

const formSchema = z.object({
    content: z.string().min(1, "Message content is required"),
});

const ChatItem: React.FC<ChatItemProps> = ({
  id, 
  content, 
  member, 
  timestamp, 
  fileUrl, 
  deleted, 
  currentMember, 
  isUpdated, 
  socketUrl, 
  socketQuery
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        content: content
    },
  });

  const handleEditSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Assume an API call to update the message
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);

      // Show success toast notification
      toast.success("Message successfully updated!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to update message:", error);

      // Show error toast notification
      toast.error("Failed to update message. Please try again.", {
        position: "top-right",
      });
    }
  };

  const isLoading = form.formState.isSubmitting;

  const { onOpen } = useModal();

  useEffect(()=> {
    if (!isEditing) {
      form.reset({ content });
    }
  }, [content, isEditing]);

  const fileType = fileUrl?.split(".").pop();
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;
  const isAdmin = currentMember?.role === 'ADMIN';
  const isModerator = currentMember?.role === 'MODERATOR';
  const isOwner = currentMember?.id === member?.id;

  const canDeleteMessages = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;

  const params = useParams();
  const router = useRouter()

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
        return;
    }
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  const handleDelete = async () => {
    try {
      // API call for deleting the message
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.delete(url);

      // Show success toast for deletion
      toast.success("Message successfully deleted!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to delete message:", error);

      // Show error toast for deletion failure
      toast.error("Failed to delete message. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className='relative group flex items-start p-4 hover:bg-gray-100 dark:hover:bg-zinc-800 transition w-full'>
      <div onClick={onMemberClick} className='cursor-pointer'>
        <UserAvatar src={member.profile.imageUrl} />
      </div>

      <div className="flex flex-col w-full ml-4">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center">
            <p onClick={onMemberClick} className='font-semibold text-xs text-gray-800 dark:text-gray-200'>
              {member?.profile?.name}
            </p>
            {roleIconMap[member?.role] && (
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            )}
          </div>
          <span className='text-xs text-gray-500 dark:text-gray-400 ml-auto'>
            {new Date(timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </span>
        </div>

        <div className="relative bg-gray-100 dark:bg-gray-700/10 p-3 rounded-lg text-gray-900 dark:text-gray-100 w-full">
          {!fileUrl && !isEditing && (
            <p className={cn("text-xs dark:text-zinc-400/90", { 'line-through': deleted })}>
              {deleted ? <i>This message was deleted</i> : content}
              {isUpdated && !deleted && (
                <span className='text-[10px] ml-2 text-gray-400 dark:text-gray-500'>(edited)</span>
              )}
            </p>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
                <form className='flex items-center w-full gap-x-2 pt-2' onSubmit={form.handleSubmit(handleEditSubmit)}>
                    <FormField control={form.control} name='content' render={({ field }) => (
                        <FormItem className='flex-1'>
                            <FormControl>
                                <Input
                                disabled={ isLoading }
                                  className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none focus-visible:ring-0 text-zinc-600 dark:text-zinc-200'
                                  placeholder='Edit message'
                                  {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}/>
                    <Button disabled={isLoading} variant="primary" type="submit" className="text-xs ">
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                    
                    <Button
                      size="sm"
                      type="button"
                      className="text-gray-500 text-xs"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                </form>
            </Form>
          )}

          {isPDF && (
            <div className="flex items-center space-x-2 mt-2">
              <FileText className="h-5 w-5 text-rose-300" />
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline">
                PDF File
              </a>
            </div>
          )}

          {isImage && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-2">
              <img src={fileUrl} alt="Uploaded Image" className="max-w-xs rounded-lg shadow-md" />
            </a>
          )}

          {canDeleteMessages && (
            <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm shadow-md">
              {canEditMessage && (
                <ActionTooltip label="Edit">
                  <button
                    type="button"
                    className="cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </ActionTooltip>
              )}

              <ActionTooltip label="Delete">
                <button
                  type="button"
                  className="cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </ActionTooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
