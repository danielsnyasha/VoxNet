'use client';

import qs from 'query-string';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';
import { useEffect } from 'react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required.",
    }).refine(
        name => name !== "general",
        {
            message: "Channel name cannot be 'general'"
        }
    ),
    type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === 'editChannel';

    // Ensure `channel` is an object with the expected properties
    const channel = data?.channel && typeof data?.channel === 'object' ? data.channel : null;
    const server = data?.server && typeof data?.server === 'object' ? data.server : null;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: channel?.name || "",
            type: channel?.type || ChannelType.TEXT,
        },
    });

    useEffect(() => {
        if (channel) {
            form.setValue("name", channel.name);
            form.setValue("type", channel.type);
        }
    }, [channel, form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            });

            await axios.patch(url, values);

            // Show success toast after updating the channel
            toast.success("Channel name successfully updated.", {
                position: "top-center",
                className: 'text-rose-500 text-center',
                autoClose: 3000, // Automatically close after 3 seconds
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            form.reset();
            router.refresh();
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error updating channel:", error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-gray-700 p-0 overflow-hidden">
                <DialogHeader className="bg-white text-gray p-0 overflow-hidden">
                    <DialogTitle className="text-2xl text-center mt-5">
                        Edit Channel
                    </DialogTitle>
                    <DialogDescription className="text-xs text-center text-blue-900">
                        Edit the channel where you can collaborate with different users.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-blue-900 dark:text-secondary/70">
                                            Channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-blue-100 focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 text-gray-700 rounded-md py-2 px-3"
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField control={form.control} name='type' render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Channel Type</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='bg-zinc-300 border-blue-100 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                                                <SelectValue placeholder="Select a channel type" className='text-blue-900' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelType).map((type) => (
                                                <SelectItem key={type} value={type} className='capitalize'>
                                                    {type.toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button
                                disabled={isLoading}
                                variant="primary"
                                className="w-full py-2 rounded-md transition-transform duration-150 hover:scale-105"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
