'use client'

import Image from "next/image";
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ActionTooltip } from "../action-tooltip";
import { useRouter } from "next/navigation";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
};

export const NavigationItem = ({

    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    const params = useParams();
    const isActive = params?.serverId === id;
    const router = useRouter()

    return (
        <ActionTooltip side="right" align='center' label={name}>
            <button 
                onClick={() => router.push(`/servers/${id}`)} // Navigate to the selected server
                className="group relative flex items-center"
            >
                {/* Left colored bar */}
                <div
                    className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all duration-300 ease-in-out w-[4px]",
                        isActive ? "h-[48px]" : "h-0"
                    )}
                    style={{
                        // Adjust the position of the white bar
                        transform: isActive ? 'translateY(0)' : 'translateY(100%)',
                    }}
                ></div>

                {/* Image Container */}
                <div className={cn(
                    "relative flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    isActive && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    {/* Image rendering with fallback */}
                    <Image
                        fill
                        src={imageUrl || "/fallback-image.png"} // Fallback image
                        alt={`${name} Icon`}
                        className="object-cover"
                    />
                </div>
            </button>
        </ActionTooltip>
    );
};
