import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    src?: string;
    className?: string;
}

export const UserAvatar = ({
    src,
    className
}: UserAvatarProps) => {
    return (
        <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
            {/* Fallback to default image if src is empty, null, or undefined */}
            <AvatarImage 
                className='outline-red-500 border-red-500 bg-blue-800' 
                src={src && src.trim() !== '' ? src : 'https://cdn.pixabay.com/photo/2014/04/02/10/25/man-303792_1280.png'} 
            />
        </Avatar>
    );
};
