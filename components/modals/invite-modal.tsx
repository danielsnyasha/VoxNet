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
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { useState } from 'react';

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const server = data?.server;

    const isModalOpen = isOpen && type === 'invite';

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const origin = useOrigin(); // Ensure this hook returns the origin
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true); // Assuming you want to set `copied` to true when copied

        // Reset the copied state after 1 second
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen("invite", {server: response.data})
        }catch (error){
            console.log(error);
        } finally {
            setIsLoading (false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="bg-white text-black p-0 overflow-hidden">
                    <DialogTitle className="text-2xl text-center mt-5">
                        Invite Friends Or Colleagues
                    </DialogTitle>
                </DialogHeader>
                <div className='p-6'>
                    <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>Server Invite Link</Label>

                    <div className='flex items-center mt-2 gap-x-2 '>
                        <Input disabled={isLoading}
                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' 
                            value={inviteUrl} 
                            readOnly // Make input read-only to prevent editing
                        />
                        <Button disabled={isLoading} size="icon" onClick={onCopy}>
                            {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                        </Button>
                    </div>
                    <Button disabled={isLoading} onClick={onNew} className='text-xs text-zinc-500 mt-4'>
                        Generate a new link
                        <RefreshCcw className='w-4 h-4 ml-2' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
