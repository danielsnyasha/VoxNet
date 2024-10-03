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

export const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const params = useParams();

    // Extract the actual string URL from the data object
    const apiUrl = typeof data?.server === 'string' ? data.server : data?.server?.imageUrl || "";  // Use imageUrl if that contains the URL

    const query = data?.channel;

    const isModalOpen = isOpen && type === 'deleteMessage';

    const [isLoading, setIsLoading] = useState(false);

    const safeQuery = query ? {
        ...query,
        createdAt: query.createdAt ? query.createdAt.toISOString() : undefined,
        updatedAt: query.updatedAt ? query.updatedAt.toISOString() : undefined,
    } : {};

    const onClick = async () => {
        try {
            setIsLoading(true);

            // Ensure `apiUrl` is a valid string URL
            const url = qs.stringifyUrl({
                url: apiUrl || " ", // Ensure this is a string URL
                query: safeQuery,
            });

            await axios.delete(url);

            // Show the success toast
            toast.success("Message has been successfully deleted.", {
                position: "top-center",
                className: 'text-rose-500 text-center',
                autoClose: 3000, // Automatically close after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            onClose();
            router.refresh();
            
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
                        Permanently Delete Message
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the message<span className='font-semibold text-rose-500'></span>?
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
