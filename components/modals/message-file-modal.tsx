'use client';

import * as z from 'zod';
import qs from 'query-string';
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

import { toast } from 'react-toastify'; // Toast notifications
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FileUpload } from '../file-upload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

const formSchema = z.object({
  fileUrl: z.string().min(1, "Attachment is required."),
});

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data ; // Fallback if `data` is undefined

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "", // Initialize as an empty string
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "", // Provide a fallback URL
        query,
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl, // Send the file URL as content
        fileUrl: values.fileUrl, // Include fileUrl separately
      });

      form.reset();
      router.refresh();
      handleClose();
      toast.success("File uploaded successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload the file");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="bg-white text-black p-0 overflow-hidden">
          <DialogTitle className="text-2xl text-center mt-5">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value ?? ""} // Ensure it's always a string
                          onChange={(fileUrl) => {
                            console.log("Uploaded File URL:", fileUrl);
                            field.onChange(fileUrl); // Ensure react-hook-form gets the file URL
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
