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
import { Label } from '@radix-ui/react-dropdown-menu';


import { useState } from 'react';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import { UserAvatar } from '../user-avatar';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const roleIconMap = {
    "GUEST" : null,
    "MODERATOR" : <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500'/>,
    "ADMIN" : <ShieldAlert className='h-4 w-4 text-rose-500'/>
}

export const MembersModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState(' ');
    const router = useRouter();

    const {server} = data as {server: ServerWithMembersWithProfiles}

    const isModalOpen = isOpen && type === 'members';

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="bg-white text-black p-0 overflow-hidden">
                    <DialogTitle className="text-2xl text-center mt-5">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                    {server?.members?.length} Members

                </DialogDescription>
                </DialogHeader>
                <ScrollArea className='mt-8 max-h-[420px] pr-6'>
    {server?.members?.map((member) => {
        console.log(member); // Add this line to debug
        return (
            <div key={member.id} className='flex items-center gap-x-2 mb-6'>
                <UserAvatar src={member.profile.imageUrl} className='bg-gray-300'/>
                <div className='flex flex-col gap-y-1'>
                    <div className='text-xs font-semibold flex items-center gap-x-1'>
                        {member.profile.name}
                        {roleIconMap[member.role]}

                    </div>
                    <p className='text-xs text-zinc-500'>
                        {member.profile.email}
                    </p>
                </div>
            </div>
        );
    })}
</ScrollArea>

                
                <div>
                   
                
                </div>
            </DialogContent>
        </Dialog>
    );
};
