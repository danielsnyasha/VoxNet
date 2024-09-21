'use client';

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

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

import { useState } from 'react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export const DeleteServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const server = data?.server;

    const isModalOpen = isOpen && type === 'deleteServer';

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/servers/${server?.id}`);

            // Show the success toast
            toast.success("Server has been successfully deleted.", {
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
            router.push('/');

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
                        Permanently Delete Server
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the server <span className='font-semibold text-rose-500'>{server?.name}</span>?
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
