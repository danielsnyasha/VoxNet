'use client';

import qs from 'query-string'

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
  } from "@/components/ui/select"
  

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

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required.",
    }).refine(
        name => name !== "general",
        {
            message: "Channel name cannot be 'general' "
        }
    ),
    type: z.nativeEnum(ChannelType)
});

export const CreateChannelModal = () => {
    const { isOpen, onClose, type } = useModal();
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === 'createChannel';

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params?.serverId
                }
            })
            await axios.post(url, values);

            form.reset();
            router.refresh();
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error creating channel:", error); 
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
                        Create Channel
                    </DialogTitle>
                    <DialogDescription className="text-xs text-center text-blue-900">
                        Create a channel where you can collaborate with different users.
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
                                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='bg-zinc-300 border-blue-100 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>

                                                <SelectValue placeholder="Select a channel type" className='text-blue-900'/>

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelType).map((type)=>(
                                                <SelectItem key={type} value={type} className='capitalize'>{type.toLowerCase()}</SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>

                                    <FormMessage/>
                                </FormItem>

                            )}/>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button 
                                disabled={isLoading} 
                                variant="primary"
                                className="w-full py-2 rounded-md transition-transform duration-150 hover:scale-105">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
