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

export const LeaveServerModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const server = data?.server;

    const isModalOpen = isOpen && type === 'leaveServer';

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async()=> {
        try{
            setIsLoading(true);

            await axios.patch(`/api/servers/${server?.id}/leave`);

            onClose();
            router.refresh();
            router.push('/')

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    

    
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="bg-white text-black p-0 overflow-hidden">
                    <DialogTitle className="text-2xl text-center mt-5">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave <span className='font-semibold text-green-500'>{server?.name}</span>?
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
