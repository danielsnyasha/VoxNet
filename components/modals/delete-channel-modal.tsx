'use client';

import * as z from 'zod';

import qs from "query-string"
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

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

import { useState } from 'react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const params = useParams();

    const server = data?.server;
    const channel = data?.channel;

    const isModalOpen = isOpen && type === 'deleteChannel';

    const [isLoading, setIsLoading] = useState(false);



    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: params?.serverId
                }
            })

            await axios.delete(url);

            // Show the success toast
            toast.success("Channel has been successfully deleted.", {
                position: "top-center",
                className: 'text-rose-500 text-center',
                autoClose: 3000, // Automatically close after 3 seconds
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            onClose();
            router.refresh();
            router.push(`/servers/${params?.serverId}`);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="bg-white text-black p-0 overflow-hidden">
                    <DialogTitle className="text-2xl text-center mt-5">
                        Permanently Delete Channel
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the channel <span className='font-semibold text-rose-500'>#{channel?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex items-center justify-between w-full'>
                        <Button disabled={isLoading}
                            onClick={onClose}
                            variant='ghost'>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} variant="primary" onClick={onClick}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
