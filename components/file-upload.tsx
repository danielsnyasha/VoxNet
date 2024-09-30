'use client';

import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

import { UploadDropzone } from "@/lib/uploadthing";
import '@uploadthing/react/styles.css';

export const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  value,
  endpoint,
}) => {
  // Extract file type (e.g., "pdf", "jpg", etc.)
  const fileType = value?.split('.').pop();

  // Handle non-PDF file conditionally
  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        {/* Display Uploaded Image */}
        <Image 
          src={value} 
          alt="Uploaded Image" 
          layout="fill" 
          objectFit="cover" 
          priority={true}  // Add priority for faster loading of uploaded images
        />
        <button
          type="button"
          onClick={() => onChange('')}  // Clear the file when clicked
          className="absolute top-0 right-0"
        >
          <X className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" type='button' />
        </button>
      </div>
    );
  }

  if (value && fileType === 'pdf') {
    return (
      <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
        <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400'/>
        <a href={value} target="_blank" rel="noopener noreferrer" className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>{value}</a>
        <button
          type="button"
          onClick={() => onChange('')}  // Clear the file when clicked
          className="absolute top-0 right-0"
        >
          <X className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm" type='button' />
        </button>

      </div>
    )
  }

  // If no valid file is uploaded yet, show the UploadDropzone
  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            onChange(res[0].url);  // Update with the first file's URL
          }
        }}
        onUploadError={(error: Error) => {
          console.log("Upload error:", error);
        }}
      />
      {/* Additional UI for when no file is uploaded */}
      
    </div>
  );
};
